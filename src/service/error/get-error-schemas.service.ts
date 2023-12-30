import { Inject, Injectable } from '@nestjs/common';
import { DependecyTokens, GLOBAL_ENTITY } from '../../application';
import { ErrorSchemasRepository } from '../../repository/error-schemas.repository';
import { ErrorSchema } from '../../schemas/error-schemas.schema';

@Injectable()
export class GetErrorSchemaService {
  constructor(
    protected readonly repository: ErrorSchemasRepository,
    @Inject(DependecyTokens.PROJECT_KEY) private readonly projectKey: string,
  ) {}
  async getAll(): Promise<ErrorSchema[]> {
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
