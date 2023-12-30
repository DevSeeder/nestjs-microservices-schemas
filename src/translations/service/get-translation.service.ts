import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { FieldTranslationsRepository } from '../repository/field-translations.repository';
import { EntityTranslationsRepository } from '../repository/entity-translations.repository';
import { ServiceKeyTranslation } from '../schemas/service-key-translations.schema';
import { REQUEST } from '@nestjs/core';
import { FieldTranslation } from '../schemas/field-translations.schema';
import {
  DEFAULT_LANG,
  SchemaDependecyTokens,
  GLOBAL_ENTITY,
} from '../../application';
import { NotFoundException } from '@devseeder/microservices-exceptions';
import { EntityTranslation } from '../schemas/entity-translations.schema';

@Injectable({ scope: Scope.REQUEST })
export class GetTranslationService extends AbstractService {
  constructor(
    protected readonly fieldRepository: FieldTranslationsRepository,
    protected readonly entityRepository: EntityTranslationsRepository,
    @Inject(SchemaDependecyTokens.SERVICE_KEY_TRANSLATION_DB)
    protected readonly serviceKeyTranslation: ServiceKeyTranslation[],
    @Inject(REQUEST) private request: Request,
    @Inject(SchemaDependecyTokens.PROJECT_KEY) private projectKey: string,
  ) {
    super();
  }

  async getFieldTranslation(
    entity: string[],
    key: string,
  ): Promise<FieldTranslation> {
    this.logger.log(
      `Searching Field Translation ${JSON.stringify({
        projectKey: this.projectKey,
        entity: {
          $in: [GLOBAL_ENTITY, ...entity],
        },
        key,
        locale: this.getLang(),
      })}`,
    );

    const items = await this.fieldRepository.find({
      projectKey: this.projectKey,
      entity: {
        $in: [GLOBAL_ENTITY, ...entity],
      },
      key,
      locale: this.getLang(),
    });

    if (!items.length) throw new NotFoundException('Field Translation');

    return items[0];
  }

  async getEntityTranslation(entity: string): Promise<EntityTranslation> {
    this.logger.log(
      `Searching entity translation ${JSON.stringify({
        projectKey: this.projectKey,
        key: entity,
        locale: this.getLang(),
      })}`,
    );
    const items = await this.entityRepository.find({
      projectKey: this.projectKey,
      key: entity,
      locale: this.getLang(),
    });

    if (!items.length) throw new NotFoundException('Entity Translation');

    return items[0];
  }

  getServiceKeyTranslation(key: string): string {
    const serviceKey = this.serviceKeyTranslation.filter(
      (serviceKey) =>
        serviceKey.key === key && serviceKey.locale === this.getLang(),
    );

    if (!serviceKey.length)
      throw new NotFoundException('Service Key Translation');

    return serviceKey[0].translation;
  }

  getLang(): string {
    return this.request.headers['lang'] || DEFAULT_LANG;
  }
}
