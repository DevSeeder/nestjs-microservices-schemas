import { Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { FieldSchema } from '../schemas/field-schemas.schema';
import { FieldSchemasRepository } from '../repository/field-schemas.repository';
import {
  SchemaDependecyTokens,
  GLOBAL_ENTITY,
  GLOBAL_PROJECT,
} from '../application';

@Injectable()
export class GetFieldSchemaService extends AbstractService {
  constructor(
    protected readonly repository: FieldSchemasRepository,
    @Inject(SchemaDependecyTokens.PROJECT_KEY)
    protected readonly projectKey: string,
  ) {
    super();
  }

  async search(entityLabels: string[]): Promise<FieldSchema[]> {
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

  async getAll(): Promise<FieldSchema[]> {
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

  async getExtRelations(
    entity: string,
    clone = false,
  ): Promise<Array<FieldSchema>> {
    this.logger.log(
      `Searching ${JSON.stringify({
        projectKey: this.projectKey,
        type: 'externalId',
        'externalRelation.service': entity,
        'externalRelation.clone': clone,
      })}`,
    );
    const itens = await this.repository.find(
      {
        projectKey: this.projectKey,
        type: 'externalId',
        'externalRelation.service': entity,
        'externalRelation.clone': clone,
      },
      { projectKey: 0 },
      { order: 1 },
      false,
    );

    return itens;
  }
}
