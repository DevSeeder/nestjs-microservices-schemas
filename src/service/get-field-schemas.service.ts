import { Inject, Injectable } from '@nestjs/common';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { FieldSchema } from 'src/schemas/field-schemas.schema';
import { FieldSchemasRepository } from 'src/repository/field-schemas.repository';
import { DependecyTokens, GLOBAL_ENTITY } from 'src/application';

@Injectable()
export class GetFieldSchemaService extends AbstractService {
  constructor(
    protected readonly repository: FieldSchemasRepository,
    @Inject(DependecyTokens.PROJECT_KEY) protected readonly projectKey: string,
  ) {
    super();
  }

  async search(entityLabels: string[]): Promise<FieldSchema[]> {
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

  async getAll(): Promise<FieldSchema[]> {
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
