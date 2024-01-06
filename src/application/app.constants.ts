import { SearchEgineOperators } from '../interface';

export const GLOBAL_ENTITY = 'global';
export const GLOBAL_PROJECT = 'GLOBAL';
export const DEFAULT_LANG = 'pt-BR';

export enum DatabaseConnections {
  SCHEMAS = 'schemasConnection',
  TRANSLATIONS = 'translationsConnection',
}

export enum SchemaDependecyTokens {
  PROJECT_KEY = 'PROJECT_KEY',
  FIELD_SCHEMA_DB = 'FIELD_SCHEMA_DB',
  ENTITY_SCHEMA_DB = 'ENTITY_SCHEMA_DB',
  ERROR_SCHEMA_DB = 'ERROR_SCHEMA_DB',
  SERVICE_KEY_TRANSLATION_DB = 'SERVICE_KEY_TRANSLATION_DB',
}

// OPERATORS ENUMS
export const SKIP_ENUMS_ALIAS = [SearchEgineOperators.IN];
export const SKIP_ENUMS = [
  SearchEgineOperators.BETWEEN,
  SearchEgineOperators.IN,
];
export const VALIDATE_ID_ENUMS = [
  SearchEgineOperators.IN,
  SearchEgineOperators.NOT_IN,
  SearchEgineOperators.NOT_EQUAL,
];
