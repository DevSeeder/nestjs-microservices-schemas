import { Inject, Injectable } from '@nestjs/common';
import { DependecyTokens, GLOBAL_ENTITY } from 'src/application';
import { ServiceKeyTranslationsRepository } from 'src/translations/repository/service-key-translations.repository';
import { ServiceKeyTranslation } from 'src/translations/schemas/service-key-translations.schema';

@Injectable()
export class GetServiceKeyTranslationService {
  constructor(
    protected readonly repository: ServiceKeyTranslationsRepository,
    @Inject(DependecyTokens.PROJECT_KEY) protected readonly projectKey: string,
  ) {}

  async getAll(): Promise<ServiceKeyTranslation[]> {
    const itens = await this.repository.find(
      {
        projectKey: {
          $in: [GLOBAL_ENTITY, this.projectKey],
        },
      },
      { projectKey: 0 },
      { order: 1 },
      false,
    );

    return itens;
  }
}
