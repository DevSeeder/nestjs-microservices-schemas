import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnections, DependecyTokens } from '../application';
import { ErrorSchemasRepository } from '../repository/error-schemas.repository';
import {
  ErrorSchema,
  ErrorSchemasSchema,
} from '../schemas/error-schemas.schema';
import { ErrorService } from '../service/error/error.service';
import { GetErrorSchemaService } from '../service/error/get-error-schemas.service';
import { TranslationsModule } from './translation.module';

@Module({})
export class ErrorSchemasModule {
  static forRootAsync(configuration, projectKey: string): DynamicModule {
    return {
      module: ErrorSchemasModule,
      imports: [
        MongooseModule.forFeature(
          [{ name: ErrorSchema.name, schema: ErrorSchemasSchema }],
          DatabaseConnections.SCHEMAS,
        ),
        TranslationsModule.forRoot(projectKey, configuration),
      ],
      controllers: [],
      providers: [
        ErrorSchemasRepository,
        GetErrorSchemaService,
        {
          provide: DependecyTokens.ERROR_SCHEMA_DB,
          useFactory: async (dataService: GetErrorSchemaService) => {
            return await dataService.getAll();
          },
          inject: [GetErrorSchemaService],
        },
        {
          provide: DependecyTokens.PROJECT_KEY,
          useValue: projectKey,
        },
        ErrorService,
      ],
      exports: [
        ErrorSchemasRepository,
        GetErrorSchemaService,
        ErrorService,
        DependecyTokens.ERROR_SCHEMA_DB,
      ],
    };
  }
}
