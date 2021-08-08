import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { TaskArray, SingleTask, DeletedTaskMsg } from '../utils/interfaces/task.interfaces';
import { Task } from '../entities/Task.entity';
import { JoiValidationPipe } from '../pipes/joiValidation.pipe';
import { createTaskSchema } from '../validation/createTaskSchema';
import { updateTaskSchema } from '../validation/updateTaskSchema';

@Controller('/v1/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasks(): Promise<TaskArray> {
    const tasks = await this.taskService.getTasks();
    return {
      tasks
    };
  }

  @Get('/:id')
  async getTask(@Param('id') id: number): Promise<SingleTask> {
    const task = await this.findTaskOrThrow(id);
    return {
      task
    };
  }

  @Get('/current')
  async getTrackedTask(): Promise<SingleTask> {
    const task = await this.taskService.getTrackedTask();
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return {
      task
    };
  }

  @Post()
  async createTask(@Body(new JoiValidationPipe(createTaskSchema)) body: CreateTaskDto): Promise<SingleTask> {
    const task = await this.taskService.createTask(body);
    return {
      task
    };
  }

  @Patch('/:id')
  async updateTask(@Param('id') id: number,
    @Body(new JoiValidationPipe(updateTaskSchema)) body: UpdateTaskDto
  ): Promise<SingleTask> {
    const taskDto: UpdateTaskDto = {
      ...body,
      id
    };
    const task = await this.taskService.updateTask(taskDto);
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return {
      task
    };
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: number): Promise<DeletedTaskMsg> {
    await this.findTaskOrThrow(id);
    await this.taskService.deleteTask({ id });
    return {
      message: 'Task deleted successfully'
    };
  }

  private async findTaskOrThrow(id: number): Promise<Task> {
    const task = await this.taskService.getTask({ id });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return task;
  }
}
