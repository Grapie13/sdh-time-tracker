import { Inject, Injectable } from '@nestjs/common';
import { Task } from 'src/entities/Task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/createTask.dto';
import { DeleteTaskDto } from './dto/deleteTask.dto';
import { GetTaskDto } from './dto/getTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: Repository<Task>
  ) {}

  async getTasks(): Promise<Task[]> {
    // Could be improved to accept task order from request query.
    return this.taskRepository.find({
      order: { id: 'ASC' }
    });
  }

  async getTask(taskDto: GetTaskDto): Promise<Task | undefined> {
    return this.taskRepository.findOne({ id: taskDto.id });
  }

  async getTrackedTask(): Promise<Task | undefined> {
    return this.taskRepository.findOne({ tracked: true });
  }

  async createTask(taskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      ...taskDto,
      createdAt: new Date().toISOString()
    });
    // If a user creates a task and tracks it,
    // untrack the currently tracked task.
    if (taskDto.tracked) {
      await this.untrackLastTracked();
      task.startedAt = new Date().toISOString();
    }
    await this.taskRepository.save(task);
    return task;
  }

  async updateTask(taskDto: UpdateTaskDto): Promise<Task | undefined> {
    const updatedTask = await this.taskRepository.findOne({ id: taskDto.id });
    if (!updatedTask) {
      return undefined;
    }
    // Only untrack a currently tracked task
    // if the task a user is updating is not tracked.
    if (taskDto.tracked && !updatedTask.tracked) {
      await this.untrackLastTracked();
      updatedTask.tracked = taskDto.tracked;
      updatedTask.startedAt = new Date().toISOString();
    }
    // Strict check to make sure "tracked" is not undefined, null or another falsy value.
    if (taskDto.tracked === false) {
      updatedTask.tracked = taskDto.tracked;
      updatedTask.finishedAt = new Date().toISOString();
    }
    updatedTask.name = taskDto.name ?? updatedTask.name;
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
      lastTracked.finishedAt = new Date().toISOString();
      await this.taskRepository.save(lastTracked);
    }
  }
}
