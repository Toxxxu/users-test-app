export interface GetUserResponseDto {
  _id: string;
  username: string;
  token: string;
  assignedTests: string[];
  completedTests: string[];
}
