import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ItemsModule } from '../items/items.module';
import { UsersModule } from '../users/users.module';

import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';

@Module({
  imports: [ConfigModule, ItemsModule, UsersModule],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
