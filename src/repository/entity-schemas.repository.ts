import { MongooseRepository } from '@devseeder/nestjs-microservices-commons';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EntitySchema,
  EntitySchemaDocument,
} from '../schemas/entity-schemas.schema';
import { DatabaseConnections } from '../application';

@Injectable()
export class EntitySchemasRepository extends MongooseRepository<
  EntitySchema,
  EntitySchemaDocument
> {
  constructor(
    @InjectModel(EntitySchema.name, DatabaseConnections.SCHEMAS)
    model: Model<EntitySchemaDocument>,
  ) {
    super(model);
  }
}
