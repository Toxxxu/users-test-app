import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DoTestRequestDto {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsNumber()
  chosenOption: number;
}
