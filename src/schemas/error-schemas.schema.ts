/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GLOBAL_ENTITY } from '../application';

export type ErrorSchemaDocument = ErrorSchema & Document;

@Schema({ timestamps: true, collection: 'errors' })
export class ErrorSchema {
  @Prop({ required: true, default: GLOBAL_ENTITY })
  projectKey: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  httpStatus: HttpStatus;

  @Prop({ required: true })
  code: number;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: false })
  translations: Translation[];
}

interface Translation {
  locale: string;
  value: string;
}

const schema = SchemaFactory.createForClass(ErrorSchema);
schema.index({ projectKey: 1, name: 1 }, { unique: true });
schema.index({ projectKey: 1, key: 1 }, { unique: true });
schema.index({ projectKey: 1, code: 1 }, { unique: true });
export const ErrorSchemasSchema = schema;
