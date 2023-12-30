import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DependecyTokens } from '../application';
import { FieldSchemasRepository } from '../repository/field-schemas.repository';
import {
  FieldSchema,
  FieldSchemasSchema,
} from '../schemas/field-schemas.schema';
import { GetFieldSchemaService } from '../service/get-field-schemas.service';

@Module({})
export class FieldSchemasModule {
  static forRoot(projectKey: string): DynamicModule {
    return {
      module: FieldSchemasModule,
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
          provide: DependecyTokens.PROJECT_KEY,
          useValue: projectKey,
        },
      ],
      exports: [FieldSchemasRepository, GetFieldSchemaService],
    };
  }
}
