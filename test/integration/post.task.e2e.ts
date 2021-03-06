import got from 'got';
import { expect } from 'chai';
import { Connection, createConnection, QueryRunner } from 'typeorm';
import { loadEnv } from './helpers/loadEnv';
import { environmentCheck } from '../../src/utils/environmentCheck';
import { jsonHeaders } from './helpers/headers';
import { checkError } from './helpers/checkError';

describe('POST /v1/tasks', () => {
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

  it('should return a 400 status if "name" parameter is not valid', async () => {
    try {
      await got('http://localhost:3000/v1/tasks', {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ name: 5 })
      });
      throw new Error('It did not throw');
    } catch (err) {
      checkError(err, 400, '"name" must be a string');
    }

    try {
      await got('http://localhost:3000/v1/tasks', {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ nameee: 'Test task' })
      });
      throw new Error('It did not throw');
    } catch (err) {
      checkError(err, 400, '"name" is required');
    }
  });

  it('should return a 400 status if "tracked" parameter is not valid', async () => {
    try {
      await got('http://localhost:3000/v1/tasks', {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ name: taskParams.name, tracked: 5 })
      });
      throw new Error('It did not throw');
    } catch (err) {
      checkError(err, 400, '"tracked" must be one of [true, false]');
    }
  });

  it('should create a task', async () => {
    const res = await got('http://localhost:3000/v1/tasks', {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(taskParams)
    });
    expect(res.statusCode).to.eq(201);
    const { task } = JSON.parse(res.body);
    expect(task).not.to.be.undefined;
    expect(task.name).to.eq(taskParams.name);
    expect(task.tracked).to.eq(taskParams.tracked);
    expect(task.createdAt).not.to.be.null;
    expect(task.startedAt).not.to.be.null;
    expect(task.finishedAt).to.be.null;
  });
});
