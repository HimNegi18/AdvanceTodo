import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto, UpdateTodoDto, CreateNaturalLanguageTodoDto } from './dto/todo.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NaturalLanguageService } from '../natural-language/natural-language.service';

@UseGuards(JwtAuthGuard)
@Controller('todos') // Changed to 'todos' for RESTful conventions
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly naturalLanguageService: NaturalLanguageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req, @Body(new ZodValidationPipe(CreateTodoDto)) createTodoDto: CreateTodoDto) {
    return this.todoService.create(req.user.id, createTodoDto);
  }

  @Post('natural-language')
  @HttpCode(HttpStatus.CREATED)
  async createFromNaturalLanguage(
    @Request() req,
    @Body(new ZodValidationPipe(CreateNaturalLanguageTodoDto)) naturalLanguageDto: CreateNaturalLanguageTodoDto,
  ) {
    const parsedTodo = await this.naturalLanguageService.parse(naturalLanguageDto.text);
    return this.todoService.create(req.user.id, parsedTodo);
  }

  @Get()
  findAll(@Request() req, @Query('search') search?: string, @Query('status') status?: string, @Query('tag') tag?: string, @Query('priority') priority?: string) {
    return this.todoService.findAll(req.user.id, {
      search,
      status: status ? (status === 'true') : undefined,
      tag,
      priority,
    });
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.todoService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body(new ZodValidationPipe(UpdateTodoDto)) updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(id, req.user.id, updateTodoDto);
  }

  @Patch(':id/complete')
  toggleCompletion(@Request() req, @Param('id') id: string) {
    return this.todoService.toggleCompletion(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req, @Param('id') id: string) {
    return this.todoService.remove(id, req.user.id);
  }
}
