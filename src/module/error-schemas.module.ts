import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnections, SchemaDependecyTokens } from '../application';
import { ErrorSchemasRepository } from '../repository/error-schemas.repository';
import {
  ErrorSchema,
  ErrorSchemasSchema,
} from '../schemas/error-schemas.schema';
import { ErrorService } from '../service/error/error.service';
import { GetErrorSchemaService } from '../service/error/get-error-schemas.service';
import { TranslationsModule } from './translation.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class ErrorSchemasModule {
  static forRoot(configuration): DynamicModule {
    return {
      module: ErrorSchemasModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
        MongooseModule.forFeature(
          [{ name: ErrorSchema.name, schema: ErrorSchemasSchema }],
          DatabaseConnections.SCHEMAS,
        ),
        TranslationsModule.forRoot(configuration),
      ],
      controllers: [],
      providers: [
        ErrorSchemasRepository,
        GetErrorSchemaService,
        {
          provide: SchemaDependecyTokens.ERROR_SCHEMA_DB,
          useFactory: async (dataService: GetErrorSchemaService) => {
            return await dataService.getAll();
          },
          inject: [GetErrorSchemaService],
        },
        {
          provide: SchemaDependecyTokens.PROJECT_KEY,
          useFactory: async (config: ConfigService) =>
            config.get<string>('doc.projectKey'),
          inject: [ConfigService],
        },
        ErrorService,
      ],
      exports: [
        ErrorSchemasRepository,
        GetErrorSchemaService,
        ErrorService,
        SchemaDependecyTokens.ERROR_SCHEMA_DB,
      ],
    };
  }
}
