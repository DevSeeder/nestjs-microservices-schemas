import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntityTranslationsRepository } from '../translations/repository/entity-translations.repository';
import { FieldTranslationsRepository } from '../translations/repository/field-translations.repository';
import { ServiceKeyTranslationsRepository } from '../translations/repository/service-key-translations.repository';
import {
  EntityTranslation,
  EntityTranslationsSchema,
} from '../translations/schemas/entity-translations.schema';
import {
  FieldTranslation,
  FieldTranslationsSchema,
} from '../translations/schemas/field-translations.schema';
import {
  ServiceKeyTranslation,
  ServiceKeyTranslationsSchema,
} from '../translations/schemas/service-key-translations.schema';
import { GetTranslationService } from '../translations/service/get-translation.service';
import { GetServiceKeyTranslationService } from '../translations/service/service-key/get-service-key-translations.service';
import { DatabaseConnections, SchemaDependecyTokens } from '../application';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class TranslationsModule {
  static forRoot(configuration): DynamicModule {
    return {
      module: TranslationsModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (config: ConfigService) => ({
            uri: config.get<string>('translations.database.connection'),
          }),
          connectionName: DatabaseConnections.TRANSLATIONS,
        }),
        MongooseModule.forFeature(
          [
            { name: FieldTranslation.name, schema: FieldTranslationsSchema },
            { name: EntityTranslation.name, schema: EntityTranslationsSchema },
            {
              name: ServiceKeyTranslation.name,
              schema: ServiceKeyTranslationsSchema,
            },
          ],
          DatabaseConnections.TRANSLATIONS,
        ),
      ],
      controllers: [],
      providers: [
        FieldTranslationsRepository,
        EntityTranslationsRepository,
        ServiceKeyTranslationsRepository,
        GetTranslationService,
        GetServiceKeyTranslationService,
        {
          provide: SchemaDependecyTokens.SERVICE_KEY_TRANSLATION_DB,
          useFactory: async (dataService: GetServiceKeyTranslationService) => {
            return await dataService.getAll();
          },
          inject: [GetServiceKeyTranslationService],
        },
        {
          provide: SchemaDependecyTokens.PROJECT_KEY,
          useFactory: async (config: ConfigService) => ({
            uri: config.get<string>('doc.projectKey'),
          }),
          inject: [ConfigService],
        },
      ],
      exports: [
        FieldTranslationsRepository,
        EntityTranslationsRepository,
        ServiceKeyTranslationsRepository,
        GetTranslationService,
        GetServiceKeyTranslationService,
        SchemaDependecyTokens.SERVICE_KEY_TRANSLATION_DB,
      ],
    };
  }
}
