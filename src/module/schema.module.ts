import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EntitySchemasModule } from './entity-schemas.module';
import { FieldSchemasModule } from './field-schemas.module';
import { DatabaseConnections, DependecyTokens } from '../application';
import { GetEntitySchemaService, GetFieldSchemaService } from '../service';

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
          connectionName: DatabaseConnections.SCHEMAS,
        }),

        EntitySchemasModule.forRoot(projectKey),
        FieldSchemasModule.forRoot(projectKey),
      ],
      controllers: [],
      providers: [
        {
          provide: DependecyTokens.FIELD_SCHEMA_DB,
          useFactory: async (dataService: GetFieldSchemaService) => {
            return await dataService.getAll();
          },
          inject: [GetFieldSchemaService],
        },
        {
          provide: DependecyTokens.ENTITY_SCHEMA_DB,
          useFactory: async (dataService: GetEntitySchemaService) => {
            return await dataService.getAll();
          },
          inject: [GetEntitySchemaService],
        },
      ],
      exports: [
        DependecyTokens.ENTITY_SCHEMA_DB,
        DependecyTokens.FIELD_SCHEMA_DB,
      ],
    };
  }
}
