import { Injectable } from '@nestjs/common';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { Automation } from '../../schemas/automation.schema';

@Injectable()
export abstract class AbstractAutomationService extends AbstractService {
  constructor(protected readonly automations: Automation[]) {
    super();
  }
}
