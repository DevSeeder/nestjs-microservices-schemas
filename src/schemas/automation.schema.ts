/* eslint-disable @typescript-eslint/no-unused-vars */
import { AbstractSchema } from '@devseeder/nestjs-microservices-commons';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AutomationDocument = Automation & Document;

@Schema({ timestamps: true, collection: 'automations' })
export class Automation extends AbstractSchema {
  @Prop({ required: true })
  projectKey: string;

  @Prop({ required: true })
  entity: string;

  @Prop({ required: true, type: Object })
  trigger: AutomationTrigger;

  @Prop({ required: true, type: Object })
  action: AutomationAction;

  @Prop({ required: true, type: Object })
  target: AutomationTarget;
}

export interface AutomationTrigger {
  triggerAction: string;
  triggerConditions?: object;
  triggerChangeConditions?: object;
}

export interface AutomationAction {
  actionService: 'crate' | 'update';
  action: string;
  fields: {
    [key: string]: any;
  };
}

export interface AutomationTarget {
  entity: string;
  where?: {
    [key: string]: any;
  };
}

const schema = SchemaFactory.createForClass(Automation);
export const AutomationsSchema = schema;
