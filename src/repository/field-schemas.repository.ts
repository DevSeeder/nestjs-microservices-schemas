import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FieldSchema,
  FieldSchemaDocument,
} from '../schemas/field-schemas.schema';
import { DatabaseConnections } from '../application';

@Injectable()
export class FieldSchemasRepository extends MongooseRepository<
  FieldSchema,
  FieldSchemaDocument
> {
  constructor(
    @InjectModel(FieldSchema.name, DatabaseConnections.SCHEMAS)
    model: Model<FieldSchemaDocument>,
  ) {
    super(model);
  }
}
