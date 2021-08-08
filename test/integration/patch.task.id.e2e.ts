import got from 'got';
import { expect } from 'chai';
import { Connection, createConnection, QueryRunner } from 'typeorm';
import { loadEnv } from './helpers/loadEnv';
import { environmentCheck } from '../../src/utils/environmentCheck';
import { jsonHeaders } from './helpers/headers';
import { checkError } from './helpers/checkError';
import { createTask } from './helpers/createTask';

describe('PATCH /v1/tasks/:id', () => {
  let connection: Connection;
  let queryRunner: QueryRunner;

  const taskParams = {
    name: 'Test task',
    tracked: true
  };

  before(async () => {
    loadEnv();
    environmentCheck(); // Check environment variables, just in case.
    // Creating a TypeORM connection to the database,
    // so that it can be cleaned before each test.
    connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: parseInt(process.env.POSTGRES_PORT!, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE
    });
    queryRunner = connection.createQueryRunner();
  });

  beforeEach(async () => {
    await queryRunner.query('DELETE FROM task');
  });

  after(async () => {
    await queryRunner.query('DELETE FROM task');
    await queryRunner.release();
    await connection.close();
  });

  it('should return a 404 status if the updated task does not exist', async () => {
    try {
      await got('http://localhost:3000/v1/tasks/500', {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify({ name: 'Updated task' })
      });
      throw new Error('It did not throw');
    } catch (err) {
      checkError(err, 404, 'Task not found');
    }
  });

  it('should return a 400 status if "name" parameter is not valid', async () => {
    try {
      const task = await createTask(taskParams.name);
      await got(`http://localhost:3000/v1/tasks/${task.id}`, {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify({ name: 5 })
      });
      throw new Error('It did not throw');
    } catch (err) {
      checkError(err, 400, '"name" must be a string');
    }

    try {
      const task = await createTask(taskParams.name);
      await got(`http://localhost:3000/v1/tasks/${task.id}`, {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify({ nameee: 'Test task' })
      });
      throw new Error('It did not throw');
    } catch (err) {
      checkError(err, 400, '"nameee" is not allowed');
    }
  });

  it('should return a 400 status if "tracked" parameter is not valid', async () => {
    try {
      const task = await createTask(taskParams.name);
      await got(`http://localhost:3000/v1/tasks/${task.id}`, {
        method: 'PATCH',
        headers: jsonHeaders,
        body: JSON.stringify({ name: taskParams.name, tracked: 5 })
      });
      throw new Error('It did not throw');
    } catch (err) {
      checkError(err, 400, '"tracked" must be one of [true, false]');
    }
  });

  it('should return a 200 status with an updated task', async () => {
    const createdTask = await createTask(taskParams.name);
    expect(createdTask.tracked).to.eq(false);
    expect(createdTask.startedAt).to.be.null;
    const res = await got(`http://localhost:3000/v1/tasks/${createdTask.id}`, {
      method: 'PATCH',
      headers: jsonHeaders,
      body: JSON.stringify({ name: 'Pet the cat', tracked: true })
    });
    expect(res.statusCode).to.eq(200);
    const { task: updatedTask } = JSON.parse(res.body);
    expect(updatedTask.id).to.eq(createdTask.id);
    expect(updatedTask.name).not.to.eq(createdTask.name);
    expect(updatedTask.name).to.eq('Pet the cat');
    expect(updatedTask.tracked).to.eq(true);
    expect(updatedTask.createdAt).to.eq(createdTask.createdAt);
    expect(updatedTask.startedAt).not.to.be.null;
    expect(updatedTask.finishedAt).to.be.null;
  });
});
