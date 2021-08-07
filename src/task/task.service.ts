import { Inject, Injectable } from '@nestjs/common';
import { Task } from 'src/entities/Task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/createTask.dto';
import { DeleteTaskDto } from './dto/deleteTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: Repository<Task>
  ) {}

  async getTasks(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async getTrackedTask(): Promise<Task | undefined> {
    return this.taskRepository.findOne({
      where: { tracked: true }
    });
  }

  async createTask(taskDto: CreateTaskDto): Promise<Task> {
    if (taskDto.tracked) {
      await this.untrackLastTracked();
    }
    const task = this.taskRepository.create(taskDto);
    await this.taskRepository.save(task);
    return task;
  }

  async updateTask(taskDto: UpdateTaskDto): Promise<Task | undefined> {
    const updatedTask = await this.taskRepository.findOne({ id: taskDto.id });
    if (!updatedTask) {
      return undefined;
    }
    if (taskDto.tracked) {
      await this.untrackLastTracked();
      updatedTask.startedAt = new Date().toUTCString();
    }
    updatedTask.tracked = taskDto.tracked ?? updatedTask.tracked;
    updatedTask.name = taskDto.newTaskName ?? updatedTask.name;
    await this.taskRepository.save(updatedTask);
    return updatedTask;
  }

  async deleteTask(taskDto: DeleteTaskDto): Promise<void> {
    await this.taskRepository.delete({ id: taskDto.id });
  }

  private async untrackLastTracked(): Promise<void> {
    const lastTracked = await this.taskRepository.findOne({ tracked: true });
    if (lastTracked) {
      lastTracked.tracked = false;
      lastTracked.finishedAt = new Date().toUTCString();
      await this.taskRepository.save(lastTracked);
    }
  }
}
