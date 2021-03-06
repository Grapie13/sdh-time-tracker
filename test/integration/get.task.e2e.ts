import got from 'got';
import { expect } from 'chai';
import { Connection, createConnection, QueryRunner } from 'typeorm';
import { loadEnv } from './helpers/loadEnv';
import { environmentCheck } from '../../src/utils/environmentCheck';
import { createTask } from './helpers/createTask';

describe('GET /v1/tasks', () => {
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

  it('should return an empty array if no tasks were created', async () => {
    const res = await got('http://localhost:3000/v1/tasks');
    expect(res.statusCode).to.eq(200);
    const { tasks } = JSON.parse(res.body);
    expect(tasks).not.to.be.undefined;
    expect(tasks.length).to.eq(0);
  });

  it('should return an array of existing tasks', async () => {
    await createTask('Test task');
    let res = await got('http://localhost:3000/v1/tasks');
    expect(res.statusCode).to.eq(200);
    const { tasks: firstResTasks } = JSON.parse(res.body);
    expect(firstResTasks).not.to.be.undefined;
    expect(firstResTasks.length).to.eq(1);
    const createdTask = await createTask('Test task');
    res = await got('http://localhost:3000/v1/tasks');
    expect(res.statusCode).to.eq(200);
    const { tasks: secondResTasks } = JSON.parse(res.body);
    expect(secondResTasks).not.to.be.undefined;
    expect(secondResTasks.length).to.eq(2);
    expect(secondResTasks[1].name).to.eq(createdTask.name);
  });
});
