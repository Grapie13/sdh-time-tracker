import { expect } from 'chai';
import got from 'got';
import { jsonHeaders } from './headers';

async function createTask(name: string, tracked?: boolean): Promise<any> {
  const res = await got('http://localhost:3000/v1/tasks', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ name, tracked })
  });
  expect(res.statusCode).to.eq(201);
  const { task } = JSON.parse(res.body);
  return task;
}

export { createTask };
