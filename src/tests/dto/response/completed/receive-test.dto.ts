import { GetQuestionsResultDto } from './get-questions-result.dto';

export interface ReceiveTestDto {
  userId: string;
  testId: string;
  title: string;
  mark: number;
  questions: GetQuestionsResultDto[];
}
