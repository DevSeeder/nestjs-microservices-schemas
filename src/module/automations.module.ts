import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnections, SchemaDependecyTokens } from '../application';
import { ConfigService } from '@nestjs/config';
import { Automation, AutomationsSchema } from '../schemas/automation.schema';
import { GetAutomationsService } from '../service/automations/get-automations.service';
import { AutomationsRepository } from '../repository/automations.repository';
import { AutomationTriggerService } from '../service/automations/automation-trigger.service';
import { AutomationActionService } from '../service/automations/automation-action.service';
import { AutomationService } from '../service/automations/automations.service';

@Module({})
export class AutomationsModule {
  static forRoot(): DynamicModule {
    return {
      module: AutomationsModule,
      imports: [
        MongooseModule.forFeature(
          [{ name: Automation.name, schema: AutomationsSchema }],
          DatabaseConnections.SCHEMAS,
        ),
      ],
      controllers: [],
      providers: [
        Automation,
        AutomationService,
        GetAutomationsService,
        AutomationTriggerService,
        AutomationActionService,
        {
          provide: SchemaDependecyTokens.PROJECT_KEY,
          useFactory: async (config: ConfigService) =>
            config.get<string>('doc.projectKey'),
          inject: [ConfigService],
        },
        {
          provide: SchemaDependecyTokens.AUTOMATIONS_DB,
          useFactory: async (dataService: GetAutomationsService) => {
            return await dataService.getAll();
          },
          inject: [GetAutomationsService],
        },
      ],
      exports: [
        AutomationsRepository,
        GetAutomationsService,
        AutomationService,
      ],
    };
  }
}
