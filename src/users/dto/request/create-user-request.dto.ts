import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(24)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(24)
  password: string;
}
