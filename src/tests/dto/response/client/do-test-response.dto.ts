import { CreateQuestionDto } from '../../questions/create-questions.dto';

export interface DoTestResponseDto {
  _id: string;
  title: string;
  questions?: CreateQuestionDto[];
}
