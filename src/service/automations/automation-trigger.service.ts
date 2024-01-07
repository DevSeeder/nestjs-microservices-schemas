import { Inject, Injectable } from '@nestjs/common';
import { AbstractAutomationService } from './abstract-automations.service';
import { DynamicValueService } from '@devseeder/nestjs-microservices-commons';
import { Automation } from '../../schemas/automation.schema';
import { SchemaDependecyTokens } from '../../application';

@Injectable()
export class AutomationTriggerService extends AbstractAutomationService {
  constructor(
    @Inject(SchemaDependecyTokens.AUTOMATIONS_DB)
    protected readonly automations: Automation[],
  ) {
    super(automations);
  }

  async checkAutomationTrigger(
    entity: string,
    accessKey: string,
    triggerItem: object,
    changedItem: object,
  ): Promise<Automation[]> {
    this.logger.log(`Looking for Automations...`);

    const autsTriggered = [];
    const entityAutomations = this.automations.filter(
      (aut) => aut.entity === entity && aut.trigger.triggerAction === accessKey,
    );

    for await (const aut of entityAutomations) {
      const objTriggered = await this.checkConditions(
        triggerItem,
        aut.trigger.triggerConditions,
      );

      if (!objTriggered) continue;

      const changeTriggered = await this.checkConditions(
        changedItem,
        aut.trigger.triggerChangeConditions,
      );

      if (!changeTriggered) continue;

      autsTriggered.push(aut);
    }

    this.logger.log(`Automations to trigger: ${JSON.stringify(autsTriggered)}`);

    return autsTriggered;
  }

  private async checkConditions(
    item: object,
    conditions: object,
  ): Promise<boolean> {
    let trigger = true;
    const clauses = Object.keys(conditions);

    if (!clauses.length) return true;

    for await (const clause of clauses) {
      const value = DynamicValueService.getDynamicValue(
        conditions[clause],
        item[clause],
        item,
      );

      if (item[clause] != value) {
        trigger = false;
        break;
      }
    }

    return trigger;
  }
}
