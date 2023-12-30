import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DatabaseConnections,
  DependecyTokens,
} from '../application/app.constants';
import { EntitySchemasRepository } from '../repository/entity-schemas.repository';
import {
  EntitySchema,
  EntitySchemasSchema,
} from '../schemas/entity-schemas.schema';
import { GetEntitySchemaService } from '../service/get-entity-schemas.service';

@Module({})
export class EntitySchemasModule {
  static forRootAsync(projectKey: string): DynamicModule {
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
          provide: DependecyTokens.PROJECT_KEY,
          useValue: projectKey,
        },
      ],
      exports: [EntitySchemasRepository, GetEntitySchemaService],
    };
  }
}
