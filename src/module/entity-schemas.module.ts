import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DependecyTokens } from '../application/app.constants';
import { EntitySchemasRepository } from '../repository/entity-schemas.repository';
import {
  EntitySchema,
  EntitySchemasSchema,
} from '../schemas/entity-schemas.schema';
import { GetEntitySchemaService } from '../service/get-entity-schemas.service';

@Module({})
export class EntitySchemasModule {
  static forRootAync(configuration, projectKey: string): DynamicModule {
    return {
      module: EntitySchemasModule,
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
        MongooseModule.forFeature([
          { name: EntitySchema.name, schema: EntitySchemasSchema },
        ]),
      ],
      controllers: [],
      providers: [
        EntitySchemasRepository,
        GetEntitySchemaService,
        {
          provide: DependecyTokens.ENTITY_SCHEMA_DB,
          useFactory: async (dataService: GetEntitySchemaService) => {
            return await dataService.getAll();
          },
          inject: [GetEntitySchemaService],
        },
        {
          provide: DependecyTokens.PROJECT_KEY,
          useValue: projectKey,
        },
      ],
      exports: [
        EntitySchemasRepository,
        GetEntitySchemaService,
        DependecyTokens.ENTITY_SCHEMA_DB,
      ],
    };
  }
}
