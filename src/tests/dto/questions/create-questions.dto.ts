import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  question: string;

  @IsArray()
  @ArrayMinSize(2)
  options: string[];

  @IsNotEmpty()
  correctOption: number;
}
