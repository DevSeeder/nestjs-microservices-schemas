import { Inject, Injectable } from '@nestjs/common';
import { AbstractAutomationService } from './abstract-automations.service';
import { DynamicValueService } from '@devseeder/nestjs-microservices-commons';
import { ModuleRef } from '@nestjs/core';
import { ClientSession } from 'mongoose';
import { Automation } from '../..//schemas/automation.schema';
import { SchemaDependecyTokens } from '../../application';

@Injectable()
export class AutomationActionService extends AbstractAutomationService {
  constructor(
    @Inject(SchemaDependecyTokens.AUTOMATIONS_DB)
    protected readonly automations: Automation[],
    protected readonly moduleRef: ModuleRef,
  ) {
    super(automations);
  }

  async executeAutomations(
    item: object,
    automationsToExecute: Automation[],
    session: ClientSession,
  ): Promise<void> {
    this.logger.log(`Executing Automations...`);
    for await (const aut of automationsToExecute) {
    }
    this.logger.log(`Automations finished.`);
  }

  async executeAutomation(
    item: object,
    automation: Automation,
    session: ClientSession,
  ): Promise<void> {
    this.logger.log(`Executing Automation ${automation}...`);
    const body = {};
    for await (const key of Object.keys(automation.action.fields)) {
      const fieldValue = automation.action.fields[key];
      body[key] = DynamicValueService.getDynamicValue(
        fieldValue,
        fieldValue,
        item,
      );
    }

    await this.executeAction(item, automation, body, session);

    this.logger.log(`Automation finished.`);
  }

  private async executeAction(
    item: object,
    automation: Automation,
    body: object,
    session: ClientSession,
  ): Promise<void> {
    const service = await this.moduleRef.get(
      `GENERIC_${automation.action.actionService.toUpperCase()}_SERVICE_${
        automation.target.entity
      }`,
    );

    const args = this.getActionArgs(
      automation.action.action,
      item,
      body,
      session,
    );

    await service[automation.action.action](...args);
  }

  private getActionArgs(
    action: string,
    item: object,
    body: object,
    session: ClientSession,
  ): any[] {
    switch (action) {
      case 'create':
        return [body, session];
      case 'updateById':
        return ['TBD', body, session];
      default:
        return [];
    }
  }
}
