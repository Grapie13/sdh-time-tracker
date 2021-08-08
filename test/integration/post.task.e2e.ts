import got from 'got';
import { expect } from 'chai';
import { Connection, createConnection, QueryRunner } from 'typeorm';
import { loadEnv } from './helpers/loadEnv';
import { environmentCheck } from '../../src/utils/environmentCheck';
import { jsonHeaders } from './helpers/headers';

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
