import { Inject, Injectable } from '@nestjs/common';
import {
  ErrorService,
  GetTranslationService,
} from '@devseeder/nestjs-microservices-schemas';
import { AbstractService } from '@devseeder/nestjs-microservices-commons';
import { AutomationTriggerService } from './automation-trigger.service';
import { SchemaDependecyTokens } from '../../application';
import { Automation } from '../../schemas/automation.schema';

@Injectable()
export class AutomationService extends AbstractService {
  protected automationTriggerService: AutomationTriggerService;
  constructor(
    protected readonly translationService: GetTranslationService,
    protected readonly errorService: ErrorService,
    @Inject(SchemaDependecyTokens.AUTOMATIONS_DB)
    protected readonly automations: Automation[],
  ) {
    super();
    this.automationTriggerService = new AutomationTriggerService(automations);
  }

  async checkAutomation(
    entity: string,
    accessKey: string,
    triggerObj: object,
    changeObj: object,
  ): Promise<boolean> {
    const autsTriggered =
      await this.automationTriggerService.checkAutomationTrigger(
        entity,
        accessKey,
        triggerObj,
        changeObj,
      );

    if (!autsTriggered.length) return false;

    return true;
  }
}
