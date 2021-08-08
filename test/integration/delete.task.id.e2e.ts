import got from 'got';
import { expect } from 'chai';
import { Connection, createConnection, QueryRunner } from 'typeorm';
import { loadEnv } from './helpers/loadEnv';
import { environmentCheck } from '../../src/utils/environmentCheck';
import { checkError } from './helpers/checkError';
import { createTask } from './helpers/createTask';

describe('DELETE /v1/tasks/:id', () => {
  let connection: Connection;
  let queryRunner: QueryRunner;

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
      await got('http://localhost:3000/v1/tasks/123', {
        method: 'DELETE'
      });
      throw new Error('It did not throw');
    } catch (err) {
      checkError(err, 404, 'Task not found');
    }
  });

  it('should delete a task', async () => {
    try {
      const createdTask = await createTask('Test task');
      const res = await got(`http://localhost:3000/v1/tasks/${createdTask.id}`, {
        method: 'DELETE'
      });
      expect(res.statusCode).to.eq(200);
      const { message } = JSON.parse(res.body);
      expect(message).to.eq('Task deleted successfully');
      await got(`http://localhost:3000/v1/tasks/${createdTask.id}`);
    } catch (err) {
      checkError(err, 404, 'Task not found');
    }
  });
});
