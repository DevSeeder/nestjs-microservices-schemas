import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DependecyTokens } from '../application/app.constants';
import { EntitySchemasRepository } from '../repository/entity-schemas.repository';
import {
  EntitySchema,
  EntitySchemasSchema,
} from '../schemas/entity-schemas.schema';
import { GetEntitySchemaService } from '../service/get-entity-schemas.service';

@Module({
  imports: [
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
  ],
  exports: [
    EntitySchemasRepository,
    GetEntitySchemaService,
    DependecyTokens.ENTITY_SCHEMA_DB,
  ],
})
export class EntitySchemasModule {}
