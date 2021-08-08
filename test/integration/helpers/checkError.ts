import { HTTPError } from 'got/dist/source';
import { expect } from 'chai';

const checkError = (err: HTTPError, statusCode: number, msg: string): void => {
  expect(err).to.be.an.instanceof(HTTPError);
  expect(err.response.statusCode).to.eq(statusCode);
  const body = JSON.parse(err.response.body as string);
  expect(body.message).to.eq(msg);
};

export { checkError };
