import { GetQuestionsResultDto } from './get-questions-result.dto';

export interface GetUserTestResultDto {
  username: string;
  title: string;
  mark: number;
  questions: GetQuestionsResultDto[];
}
