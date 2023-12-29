import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DependecyTokens } from '../application/app.constants';
import { EntitySchemasModule } from './entity-schemas.module';
import { FieldSchemasModule } from './field-schemas.module';

@Module({})
export class SchemasModule {
  static forRootAync(configuration, projectKey: string): DynamicModule {
    return {
      module: SchemasModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => ({
            uri: config.get<string>('schemas.database.connection'),
          }),
        }),
        EntitySchemasModule,
        FieldSchemasModule,
      ],
      controllers: [],
      providers: [
        {
          provide: DependecyTokens.PROJECT_KEY,
          useValue: projectKey,
        },
      ],
      exports: [DependecyTokens.PROJECT_KEY],
    };
  }
}
