import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { environmentCheck } from './utils/environmentCheck';

async function bootstrap() {
  environmentCheck(); // Check for missing environment variables before attempting to create a server
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const PORT = parseInt(process.env.PORT!, 10); // Non-null assertion, because environment variables were checked in a function above
  await app.listen(PORT);
}
void bootstrap();
