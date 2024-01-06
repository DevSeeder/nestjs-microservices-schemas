import { Inject, Injectable } from '@nestjs/common';
import { SchemaDependecyTokens, GLOBAL_PROJECT } from '../../../application';
import { ServiceKeyTranslationsRepository } from '../../../translations/repository/service-key-translations.repository';
import { ServiceKeyTranslation } from '../../../translations/schemas/service-key-translations.schema';

@Injectable()
export class GetServiceKeyTranslationService {
  constructor(
    protected readonly repository: ServiceKeyTranslationsRepository,
    @Inject(SchemaDependecyTokens.PROJECT_KEY)
    protected readonly projectKey: string,
  ) {}

  async getAll(): Promise<ServiceKeyTranslation[]> {
    const itens = await this.repository.find(
      {
        projectKey: {
          $in: [GLOBAL_PROJECT, this.projectKey],
        },
      },
      { projectKey: 0 },
      { order: 1 },
      false,
    );

    return itens;
  }
}
