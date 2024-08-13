import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item) private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run SEED on Prod');
    }

    await this.deleteDatabase();

    const users = await this.loadUsers();

    await this.loadItems(users);

    return true;
  }

  async deleteDatabase() {
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User[]> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users;
  }

  async loadItems(users: User[]) {
    const itemsPromises = [];

    for (const item of SEED_ITEMS) {
      const randomIndex = Math.floor(Math.random() * users.length);
      const user = users.at(randomIndex);
      itemsPromises.push(this.itemsService.create(item, user));
    }

    await Promise.all(itemsPromises);
  }
}
