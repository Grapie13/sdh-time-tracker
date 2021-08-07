import { Task } from 'src/entities/Task.entity';

// These interfaces simplify the look of return declarations
// inside the task controller.

interface TaskArray  {
  tasks: Task[]
}

interface SingleTask {
  task: Task
}

interface DeletedTaskMsg {
  message: string
}

export {
  TaskArray,
  SingleTask,
  DeletedTaskMsg
};
