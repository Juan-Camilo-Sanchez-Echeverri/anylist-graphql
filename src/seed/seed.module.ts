import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ItemsModule } from '../items/items.module';
import { UsersModule } from '../users/users.module';

import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';
import { ListItemModule } from '../list-item/list-item.module';
import { ListsModule } from '../lists/lists.module';

@Module({
  imports: [
    ConfigModule,
    ItemsModule,
    UsersModule,
    ListItemModule,
    ListsModule,
  ],
  providers: [SeedResolver, SeedService],
})
export class SeedModule {}
