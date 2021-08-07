import sinon from 'ts-sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import { Test } from '@nestjs/testing';
import { TaskController } from '../../src/task/task.controller';
import { TaskService } from '../../src/task/task.service';
import { Task } from '../../src/entities/Task.entity';
import { CreateTaskDto } from '../../src/task/dto/createTask.dto';
import { HttpException } from '@nestjs/common';

interface FindOneOpts {
  id?: number;
  tracked?: boolean;
}

interface DeleteOpts {
  id: number
}

chai.use(sinonChai);
const { expect } = chai;

describe('Task Service', () => {
  let taskController: TaskController;
  let tasks: Task[] = [];
  const testTask = {
    name: 'Test task'
  };

  function* generator(num: number): IterableIterator<number> {
    while (true) {
      yield num++;
    }
  }

  let idGenerator = generator(1);

  before(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: 'TASK_REPOSITORY',
          useValue: {
            find: sinon.stub().resolves(tasks),
            findOne: sinon.stub().callsFake(async (opts: FindOneOpts) => {
              return new Promise((resolve) => {
                if (opts.id) {
                  const returned = tasks.find(dbTask => dbTask.id === opts.id);
                  resolve(returned);
                  return;
                } 
                if (opts.tracked) {
                  const returned = tasks.find(dbTask => dbTask.tracked === opts.tracked);
                  resolve(returned);
                  return;
                }
              });
            }),
            create: sinon.stub().callsFake((taskDto: CreateTaskDto) => {
              if (taskDto.tracked) {
                tasks = tasks.map(dbTask => {
                  if (dbTask.tracked) {
                    dbTask.tracked = false;
                    dbTask.finishedAt = new Date().toISOString();
                  }
                  return dbTask;
                });
              }
              const task = {
                name: taskDto.name,
                tracked: taskDto.tracked ?? false,
                id: idGenerator.next().value,
                createdAt: new Date().toISOString(),
                startedAt: null,
                finishedAt: null
              };
              return task;
            }),
            save: sinon.stub().callsFake(async (task: Task) => {
              return new Promise((resolve) => {
                tasks.push(task);
                resolve(task);
              });
            }),
            delete: sinon.stub().callsFake(async (opts: DeleteOpts) => {
              return new Promise((resolve) => {
                tasks = tasks.filter(dbTask => dbTask.id !== opts.id);
                resolve(true);
              });
            })
          }
        },
        TaskService
      ]
    }).compile();
    taskController = moduleRef.get<TaskController>(TaskController);
  });

  beforeEach(() => {
    // Reset the "id generator" to start over from 1.
    idGenerator = generator(1);
    // Remove all tasks from the array.
    while (tasks.length > 0) {
      tasks.pop();
    }
    sinon.resetHistory();
  });

  after(() => {
    sinon.restore();
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      let response = await taskController.getTasks();
      expect(response.tasks.length).to.eq(0);
      await taskController.createTask(testTask);
      response = await taskController.getTasks();
      expect(response.tasks.length).to.eq(1);
      await taskController.createTask(testTask);
      response = await taskController.getTasks();
      expect(response.tasks.length).to.eq(2);
    });
  });

  describe('getTask', () => {
    it('should throw a not found error if the task does not exist', async () => {
      try {
        await taskController.getTask(5);
        throw new Error('It should have thrown');
      } catch (err) {
        expect(err).to.be.an.instanceof(HttpException);
        expect(err.status).to.eq(404);
        expect(err.response).to.eq('Task not found');
      }
    });

    it('should return a task by its id', async () => {
      await taskController.createTask(testTask);
      await taskController.createTask(testTask);
      await taskController.createTask(testTask);
      await taskController.createTask({ name: 'Task number 4' });
      const response = await taskController.getTask(4);
      expect(response.task.name).to.eq('Task number 4');
      expect(response.task.id).to.eq(4);
      expect(response.task.tracked).to.eq(false);
    });
  });

  describe('getTrackedTask', () => {
    it('should throw a not found error if no task is tracked', async () => {
      try {
        await taskController.createTask(testTask);
        await taskController.createTask(testTask);
        await taskController.createTask(testTask);
        await taskController.getTrackedTask();
        throw new Error('It should have thrown');
      } catch (err) {
        expect(err).to.be.an.instanceof(HttpException);
        expect(err.status).to.eq(404);
        expect(err.response).to.eq('Task not found');
      }
    });

    it('should return the currently tracked task', async () => {
      await taskController.createTask(testTask);
      await taskController.createTask(testTask);
      await taskController.createTask({ name: 'Tracked task', tracked: true });
      const response = await taskController.getTrackedTask();
      expect(response.task.name).to.eq('Tracked task');
      expect(response.task.id).to.eq(3);
      expect(response.task.tracked).to.eq(true);
    });

    it('should always return the task that was set as tracked as the last one', async () => {
      await taskController.createTask({ ...testTask, tracked: true });
      await taskController.createTask({ name: 'The important one', tracked: true });
      const response = await taskController.getTrackedTask();
      expect(response.task.name).to.eq('The important one');
      expect(response.task.id).to.eq(2);
      expect(response.task.tracked).to.eq(true);
    });
  });

  describe('createTask', () => {
    it('should create and return task', async () => {
      const response = await taskController.createTask({ ...testTask, tracked: true });
      expect(response.task.name).to.eq(testTask.name);
      expect(response.task.tracked).to.eq(true);
      expect(response.task.id).to.eq(1);
      expect(response.task.createdAt).not.to.be.null;
      expect(response.task.startedAt).not.to.be.null;
      expect(response.task.finishedAt).to.be.null;
    });

    it('should set any tracked task to untracked if the user creates another tracked task', async () => {
      let firstTaskRes = await taskController.createTask({ ...testTask, tracked: true });
      expect(firstTaskRes.task.tracked).to.eq(true);
      const secondTaskRes = await taskController.createTask({ name: 'Big task', tracked: true });
      firstTaskRes = await taskController.getTask(firstTaskRes.task.id);
      expect(secondTaskRes.task.tracked).to.eq(true);
      expect(firstTaskRes.task.tracked).to.eq(false);
    });
  });

  describe('updateTask', () => {
    it('should throw a not found error if the updated task does not exist', async () => {
      try {
        await taskController.updateTask(5, { id: 5, tracked: true });
        throw new Error('It should have thrown');
      } catch (err) {
        expect(err).to.be.an.instanceof(HttpException);
        expect(err.status).to.eq(404);
        expect(err.response).to.eq('Task not found');
      }
    });

    it('should update a task', async () => {
      await taskController.createTask(testTask);
      const response = await taskController.updateTask(1, { id: 1, tracked: true });
      expect(response.task.tracked).to.eq(true);
    });

    it('should set tracked property to false and set finishedAt property to an ISO date string', async () => {
      await taskController.createTask({ ...testTask, tracked: true });
      const response = await taskController.updateTask(1, { id: 1, tracked: false });
      expect(response.task.tracked).to.eq(false);
      expect(response.task.finishedAt).not.to.be.null;
    });
  });

  describe('deleteTask', () => {
    it('should throw a not found error if the deleted task does not exist', async () => {
      try {
        await taskController.deleteTask(5);
        throw new Error('It should have thrown');
      } catch (err) {
        expect(err).to.be.an.instanceof(HttpException);
        expect(err.status).to.eq(404);
        expect(err.response).to.eq('Task not found');
      }
    });

    it('should delete a task and return a message', async () => {
      await taskController.createTask(testTask);
      const response = await taskController.deleteTask(1);
      expect(response.message).to.eq('Task deleted successfully');
    });
  });
});
