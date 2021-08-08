import got from 'got';
import { expect } from 'chai';
import { Connection, createConnection, QueryRunner } from 'typeorm';
import { loadEnv } from './helpers/loadEnv';
import { environmentCheck } from '../../src/utils/environmentCheck';

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
});
