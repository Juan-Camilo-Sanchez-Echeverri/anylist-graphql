import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  SetMetadata,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    if (!user) {
      throw new InternalServerErrorException('No user inside the request');
    }

    if (roles.length === 0) return user;

    for (const role of user.roles) {
      if (roles.includes(role as ValidRoles)) return user;
    }

    throw new ForbiddenException();
  },
);
