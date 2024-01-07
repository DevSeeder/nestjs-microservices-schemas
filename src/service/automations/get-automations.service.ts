import { Injectable } from '@nestjs/common';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { ConfigService } from '@nestjs/config';
import { AutomationsRepository } from '../../repository/automations.repository';
import { Automation } from '../../schemas/automation.schema';
import { GLOBAL_PROJECT } from '../../application';

@Injectable()
export class GetAutomationsService extends AbstractService {
  constructor(
    protected readonly repository: AutomationsRepository,
    protected readonly configService?: ConfigService,
  ) {
    super();
  }

  async getAll(): Promise<Automation[]> {
    const searchParams = {
      projectKey: {
        $in: [GLOBAL_PROJECT, this.configService.get<string>('doc.projectKey')],
      },
    };
    this.logger.log(
      `Searching Automations...: ${JSON.stringify(searchParams)}`,
    );
    const items = await this.repository.find(searchParams);
    return items;
  }
}
