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
import { DatabaseConnections, DependecyTokens } from '../application';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class TranslationsModule {
  static forRoot(projectKey: string, configuration): DynamicModule {
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
            uri: config.get<string>('schemas.database.connection'),
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
          provide: DependecyTokens.SERVICE_KEY_TRANSLATION_DB,
          useFactory: async (dataService: GetServiceKeyTranslationService) => {
            return await dataService.getAll();
          },
          inject: [GetServiceKeyTranslationService],
        },
        {
          provide: DependecyTokens.PROJECT_KEY,
          useValue: projectKey,
        },
      ],
      exports: [
        FieldTranslationsRepository,
        EntityTranslationsRepository,
        ServiceKeyTranslationsRepository,
        GetTranslationService,
        GetServiceKeyTranslationService,
        DependecyTokens.SERVICE_KEY_TRANSLATION_DB,
      ],
    };
  }
}
