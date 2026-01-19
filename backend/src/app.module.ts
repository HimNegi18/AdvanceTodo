import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { TodoModule } from './todo/todo.module';
import { NaturalLanguageModule } from './natural-language/natural-language.module';

@Module({
  imports: [AuthModule, PrismaModule, TodoModule, NaturalLanguageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
