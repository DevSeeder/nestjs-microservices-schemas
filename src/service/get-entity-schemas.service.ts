import { Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { EntitySchemasRepository } from '../repository/entity-schemas.repository';
import {
  SchemaDependecyTokens,
  GLOBAL_ENTITY,
  GLOBAL_PROJECT,
} from '../application/app.constants';
import { EntitySchema } from '../schemas/entity-schemas.schema';

@Injectable()
export class GetEntitySchemaService extends AbstractService {
  constructor(
    protected readonly repository: EntitySchemasRepository,
    @Inject(SchemaDependecyTokens.PROJECT_KEY)
    protected readonly projectKey: string,
  ) {
    super();
  }

  async search(entityLabels: string[]): Promise<EntitySchema[]> {
    const itens = await this.repository.find(
      {
        projectKey: {
          $in: [this.projectKey, GLOBAL_PROJECT],
        },
        entity: {
          $in: [...entityLabels, GLOBAL_ENTITY],
        },
      },
      { projectKey: 0 },
      { order: 1 },
      false,
    );

    return itens;
  }

  async getAll(): Promise<EntitySchema[]> {
    const itens = await this.repository.find(
      {
        projectKey: {
          $in: [this.projectKey, GLOBAL_PROJECT],
        },
      },
      { projectKey: 0 },
      { order: 1 },
      false,
    );

    return itens;
  }
}
