import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // Load environment variables
  const app = await NestFactory.create(AppModule);
  await app.listen(7000); // You can change this port if needed
}
bootstrap();



