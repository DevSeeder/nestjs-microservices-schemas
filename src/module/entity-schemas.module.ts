import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DatabaseConnections,
  SchemaDependecyTokens,
} from '../application/app.constants';
import { EntitySchemasRepository } from '../repository/entity-schemas.repository';
import {
  EntitySchema,
  EntitySchemasSchema,
} from '../schemas/entity-schemas.schema';
import { GetEntitySchemaService } from '../service/get-entity-schemas.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class EntitySchemasModule {
  static forRoot(): DynamicModule {
    return {
      module: EntitySchemasModule,
      imports: [
        MongooseModule.forFeature(
          [{ name: EntitySchema.name, schema: EntitySchemasSchema }],
          DatabaseConnections.SCHEMAS,
        ),
      ],
      controllers: [],
      providers: [
        EntitySchemasRepository,
        GetEntitySchemaService,
        {
          provide: SchemaDependecyTokens.PROJECT_KEY,
          useFactory: async (config: ConfigService) => ({
            uri: config.get<string>('doc.projectKey'),
          }),
        },
      ],
      exports: [EntitySchemasRepository, GetEntitySchemaService],
    };
  }
}
