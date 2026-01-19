import { Module } from '@nestjs/common';
import { NaturalLanguageService } from './natural-language.service';

@Module({
  providers: [NaturalLanguageService]
})
export class NaturalLanguageModule {}
