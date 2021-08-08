import got from 'got';
import { expect } from 'chai';
import { Connection, createConnection, QueryRunner } from 'typeorm';
import { loadEnv } from './helpers/loadEnv';
import { environmentCheck } from '../../src/utils/environmentCheck';
import { createTask } from './helpers/createTask';
import { checkError } from './helpers/checkError';

describe('GET /v1/tasks/:id', () => {
  let connection: Connection;
  let queryRunner: QueryRunner;

  before(async () => {
    loadEnv();
    environmentCheck(); // Check environment variables, just in case.
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

  it('should return a 404 status if the task does not exist', async () => {
    try {
      await got('http://localhost:3000/v1/tasks/500');
      throw new Error('It did not throw');
    } catch (err) {
      checkError(err, 404, 'Task not found');
    }
  });

  it('should return a task with its details', async () => {
    const taskName = 'Test task';
    const createdTask = await createTask(taskName, true);
    const res = await got(`http://localhost:3000/v1/tasks/${createdTask.id}`);
    expect(res.statusCode).to.eq(200);
    const { task } = JSON.parse(res.body);
    expect(task.name).to.eq(taskName);
    expect(task.tracked).to.eq(true);
    expect(task.createdAt).not.to.be.null;
    expect(task.startedAt).not.to.be.null;
    expect(task.finishedAt).to.be.null;
  });
});
