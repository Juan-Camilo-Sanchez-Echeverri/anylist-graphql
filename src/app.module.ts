import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';

import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join((process.cwd(), 'src/schema.gql')),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        includeStacktraceInErrorResponses: false,
        autoTransformHttpErrors: false,
        context({ req }: { req: Request }) {
          const token = req.headers.authorization?.replace('Bearer ', '');

          if (!token) throw Error('Token needed');

          const payload = jwtService.decode(token);

          if (!payload) throw Error('Token not valid');
        },
      }),
    }),
    /* GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join((process.cwd(), 'src/schema.gql')),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      includeStacktraceInErrorResponses: false,
      autoTransformHttpErrors: false,
    }), */
    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl:
        process.env.STATE === 'prod'
          ? {
              rejectUnauthorized: false,
              sslmode: 'require',
            }
          : (false as any),
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
    ListItemModule,
  ],
})
export class AppModule {
  constructor() {
    console.log('State', process.env.STATE);
    console.log('host', process.env.DB_HOST);
    console.log('port', +process.env.DB_PORT);
    console.log('username', process.env.DB_USERNAME);
    console.log('password', process.env.DB_PASSWORD);
    console.log('database', process.env.DB_NAME);
  }
}
