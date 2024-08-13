import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  fullName: string;

  @Field(() => String)
  @MinLength(6)
  password: string;
}
