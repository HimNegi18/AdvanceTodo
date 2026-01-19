import { Injectable } from '@nestjs/common';
import * as chrono from 'chrono-node';
import { formatISO } from 'date-fns';
import { Priority } from '../generated/prisma';
import { CreateTodoDto } from '../todo/dto/todo.dto';

@Injectable()
export class NaturalLanguageService {
  async parse(text: string): Promise<CreateTodoDto> {
    let title = text;
    let dueDate: string | undefined;
    let priority: Priority | undefined;
    let tags: string | undefined;

    // 1. Extract Due Date using chrono-node
    const parsedDate = chrono.parse(text);
    if (parsedDate.length > 0) {
      const date = parsedDate[0].start.date();
      dueDate = formatISO(date);
      title = title.replace(parsedDate[0].text, '').trim();
    }

    // 2. Extract Priority
    const priorityRegex = /(priority:|p:)\s*(low|medium|high|urgent)/i;
    const priorityMatch = title.match(priorityRegex);
    if (priorityMatch) {
      priority = (priorityMatch[2].toUpperCase()) as Priority;
      title = title.replace(priorityMatch[0], '').trim();
    }

    // 3. Extract Tags (e.g., #work, @home)
    const tagsRegex = /(#\w+|@\w+)/g;
    const tagsMatches = title.match(tagsRegex);
    if (tagsMatches) {
      tags = tagsMatches.map(tag => tag.substring(1)).join(',');
      title = title.replace(tagsRegex, '').trim();
    }

    return {
      title: title.trim(),
      dueDate,
      priority,
      tags,
    };
  }
}
