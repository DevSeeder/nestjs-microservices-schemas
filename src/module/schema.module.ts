import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EntitySchemasModule } from './entity-schemas.module';
import { FieldSchemasModule } from './field-schemas.module';
import { DependecyTokens } from '../application';

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
        EntitySchemasModule.forRoot(projectKey),
        FieldSchemasModule.forRoot(projectKey),
      ],
      controllers: [],
      providers: [],
      exports: [
        DependecyTokens.ENTITY_SCHEMA_DB,
        DependecyTokens.FIELD_SCHEMA_DB,
      ],
    };
  }
}
