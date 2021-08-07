import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { environmentCheck } from './utils/environmentCheck';

async function bootstrap() {
  environmentCheck();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const PORT = parseInt(process.env.APP_PORT!, 10);
  await app.listen(PORT, '0.0.0.0');
}
void bootstrap();
