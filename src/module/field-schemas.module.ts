import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DependecyTokens } from '../application';
import { FieldSchemasRepository } from '../repository/field-schemas.repository';
import {
  FieldSchema,
  FieldSchemasSchema,
} from '../schemas/field-schemas.schema';
import { GetFieldSchemaService } from '../service/get-field-schemas.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FieldSchema.name, schema: FieldSchemasSchema },
    ]),
  ],
  controllers: [],
  providers: [
    FieldSchemasRepository,
    GetFieldSchemaService,
    {
      provide: DependecyTokens.FIELD_SCHEMA_DB,
      useFactory: async (dataService: GetFieldSchemaService) => {
        return await dataService.getAll();
      },
      inject: [GetFieldSchemaService],
    },
  ],
  exports: [
    FieldSchemasRepository,
    GetFieldSchemaService,
    DependecyTokens.FIELD_SCHEMA_DB,
  ],
})
export class FieldSchemasModule {}
