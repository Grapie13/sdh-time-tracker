import dotenv from 'dotenv';
import { join } from 'path';

function loadEnv(): dotenv.DotenvConfigOutput {
  return dotenv.config({
    path: join(__dirname, '../../../config/test.env')
  });
}

export { loadEnv };
