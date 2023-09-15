import { GetTestQuestionsDto } from './get-test-questions.dto';

export interface GetTestResponseDto {
  _id: string;
  title: string;
  questions?: GetTestQuestionsDto[];
  completedBy?: string[];
}
