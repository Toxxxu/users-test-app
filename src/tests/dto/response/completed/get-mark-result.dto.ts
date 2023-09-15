import { GetQuestionsResultDto } from './get-questions-result.dto';

export interface GetMarkResultDto {
  mark: number;
  questions: GetQuestionsResultDto[];
}
