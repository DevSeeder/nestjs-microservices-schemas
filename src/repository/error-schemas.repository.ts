import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ErrorSchema,
  ErrorSchemaDocument,
} from '../schemas/error-schemas.schema';
import { DatabaseConnections } from '../application';

@Injectable()
export class ErrorSchemasRepository extends MongooseRepository<
  ErrorSchema,
  ErrorSchemaDocument
> {
  constructor(
    @InjectModel(ErrorSchema.name, DatabaseConnections.SCHEMAS)
    model: Model<ErrorSchemaDocument>,
  ) {
    super(model);
  }
}
