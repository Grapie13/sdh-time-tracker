import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    DatabaseModule, 
    TaskModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
