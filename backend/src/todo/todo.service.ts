import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTodoDto: CreateTodoDto) {
    const { tags, ...rest } = createTodoDto;
    return this.prisma.todo.create({
      data: {
        ...rest,
        userId,
        tags: tags || '', // Store tags as a single string
        dueDate: createTodoDto.dueDate ? new Date(createTodoDto.dueDate) : null,
      },
    });
  }

  async findAll(userId: string, query?: { search?: string; status?: boolean; tag?: string; priority?: string }) {
    const where: any = { userId };

    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.status !== undefined) {
      where.completed = query.status;
    }

    if (query?.tag) {
      where.tags = { contains: query.tag, mode: 'insensitive' };
    }

    if (query?.priority) {
      where.priority = query.priority.toUpperCase();
    }

    return this.prisma.todo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const todo = await this.prisma.todo.findUnique({
      where: { id, userId },
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: string, userId: string, updateTodoDto: UpdateTodoDto) {
    const { tags, dueDate, ...rest } = updateTodoDto;
    const todo = await this.prisma.todo.update({
      where: { id, userId },
      data: {
        ...rest,
        tags: tags !== undefined ? tags : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async remove(id: string, userId: string) {
    const todo = await this.prisma.todo.delete({
      where: { id, userId },
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async toggleCompletion(id: string, userId: string) {
    const todo = await this.prisma.todo.findUnique({ where: { id, userId } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return this.prisma.todo.update({
      where: { id, userId },
      data: { completed: !todo.completed },
    });
  }
}
