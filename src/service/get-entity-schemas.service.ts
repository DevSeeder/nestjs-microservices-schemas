import { Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { EntitySchemasRepository } from 'src/repository/entity-schemas.repository';
import { DependecyTokens, GLOBAL_ENTITY } from 'src/application/app.constants';
import { EntitySchema } from 'src/schemas/entity-schemas.schema';

@Injectable()
export class GetEntitySchemaService extends AbstractService {
  constructor(
    protected readonly repository: EntitySchemasRepository,
    @Inject(DependecyTokens.PROJECT_KEY) protected readonly projectKey: string,
  ) {
    super();
  }

  async search(entityLabels: string[]): Promise<EntitySchema[]> {
    const itens = await this.repository.find(
      {
        projectKey: this.projectKey,
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
        projectKey: this.projectKey,
      },
      { projectKey: 0 },
      { order: 1 },
      false,
    );

    return itens;
  }
}
