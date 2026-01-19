import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { NaturalLanguageModule } from '../natural-language/natural-language.module';

@Module({
  imports: [PrismaModule, AuthModule, NaturalLanguageModule],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule {}
