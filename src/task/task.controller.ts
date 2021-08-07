import { Controller, Get } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from '../entities/Task.entity';

@Controller('/v1/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasks(): Promise<{
    tasks: Task[]
  }> {
    const tasks = await this.taskService.getTasks();
    return {
      tasks
    };
  }
}
