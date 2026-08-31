export type SchemaField = {
  name: string;
  type: string;
  pk?: boolean;
  fk?: string;
  nullable?: boolean;
};

export type SchemaTable = {
  name: string;
  fields: SchemaField[];
};

export type SchemaRelation = {
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
};

export const SCHEMA_TABLES: SchemaTable[] = [
  {
    name: 'employees',
    fields: [
      { name: 'id', type: 'INTEGER', pk: true },
      { name: 'username', type: 'TEXT', nullable: false },
      { name: 'full_name', type: 'TEXT', nullable: false },
      { name: 'department', type: 'TEXT', nullable: false },
      { name: 'pos', type: 'TEXT', nullable: false },
      { name: 'clearance_level', type: 'INTEGER', nullable: false },
      { name: 'status', type: 'TEXT', nullable: false },
      { name: 'assigned_location_id', type: 'INTEGER', fk: 'locations.id', nullable: true },
    ],
  },
  {
    name: 'locations',
    fields: [
      { name: 'id', type: 'INTEGER', pk: true },
      { name: 'name', type: 'TEXT', nullable: false },
      { name: 'sector', type: 'TEXT', nullable: false },
      { name: 'security_level', type: 'INTEGER', nullable: false },
    ],
  },
  {
    name: 'access_logs',
    fields: [
      { name: 'id', type: 'INTEGER', pk: true },
      { name: 'employee_id', type: 'INTEGER', fk: 'employees.id', nullable: false },
      { name: 'location_id', type: 'INTEGER', fk: 'locations.id', nullable: false },
      { name: 'action_type', type: 'TEXT', nullable: false },
      { name: 'created_at', type: 'DATETIME', nullable: false },
      { name: 'access_granted', type: 'INTEGER', nullable: false },
    ],
  },
  {
    name: 'messages',
    fields: [
      { name: 'id', type: 'INTEGER', pk: true },
      { name: 'sender_id', type: 'INTEGER', fk: 'employees.id', nullable: false },
      { name: 'receiver_id', type: 'INTEGER', fk: 'employees.id', nullable: false },
      { name: 'created_at', type: 'DATETIME', nullable: false },
      { name: 'subject', type: 'TEXT', nullable: false },
      { name: 'body', type: 'TEXT', nullable: false },
      { name: 'is_encrypted', type: 'INTEGER', nullable: false },
    ],
  },
  {
    name: 'incidents',
    fields: [
      { name: 'id', type: 'INTEGER', pk: true },
      { name: 'location_id', type: 'INTEGER', fk: 'locations.id', nullable: false },
      { name: 'created_at', type: 'DATETIME', nullable: false },
      { name: 'severity', type: 'TEXT', nullable: false },
      { name: 'description', type: 'TEXT', nullable: false },
    ],
  },
  {
    name: 'audit_logs',
    fields: [
      { name: 'id', type: 'INTEGER', pk: true },
      { name: 'employee_id', type: 'INTEGER', fk: 'employees.id', nullable: false },
      { name: 'triggered_by', type: 'INTEGER', fk: 'employees.id', nullable: false },
      { name: 'action', type: 'TEXT', nullable: false },
      { name: 'target', type: 'TEXT', nullable: false },
      { name: 'created_at', type: 'DATETIME', nullable: false },
    ],
  },
  {
    name: 'internal_projects',
    fields: [
      { name: 'id', type: 'INTEGER', pk: true },
      { name: 'project_code', type: 'TEXT', nullable: false },
      { name: 'lead_id', type: 'INTEGER', fk: 'employees.id', nullable: false },
      { name: 'classification', type: 'TEXT', nullable: false },
      { name: 'status', type: 'TEXT', nullable: false },
      { name: 'budget', type: 'INTEGER', nullable: false },
    ],
  },
  {
    name: 'infrastructure_nodes',
    fields: [
      { name: 'id', type: 'INTEGER', pk: true },
      { name: 'node_name', type: 'TEXT', nullable: false },
      { name: 'parent_id', type: 'INTEGER', fk: 'infrastructure_nodes.id', nullable: true },
      { name: 'linked_sibling_id', type: 'INTEGER', fk: 'infrastructure_nodes.id', nullable: true },
      { name: 'node_type', type: 'TEXT', nullable: false },
      { name: 'security_level', type: 'INTEGER', nullable: false },
    ],
  },
];

export const SCHEMA_RELATIONS: SchemaRelation[] = [
  { fromTable: 'employees', fromField: 'assigned_location_id', toTable: 'locations', toField: 'id' },
  { fromTable: 'access_logs', fromField: 'employee_id', toTable: 'employees', toField: 'id' },
  { fromTable: 'access_logs', fromField: 'location_id', toTable: 'locations', toField: 'id' },
  { fromTable: 'messages', fromField: 'sender_id', toTable: 'employees', toField: 'id' },
  { fromTable: 'messages', fromField: 'receiver_id', toTable: 'employees', toField: 'id' },
  { fromTable: 'incidents', fromField: 'location_id', toTable: 'locations', toField: 'id' },
  { fromTable: 'audit_logs', fromField: 'employee_id', toTable: 'employees', toField: 'id' },
  { fromTable: 'audit_logs', fromField: 'triggered_by', toTable: 'employees', toField: 'id' },
  { fromTable: 'internal_projects', fromField: 'lead_id', toTable: 'employees', toField: 'id' },
  { fromTable: 'infrastructure_nodes', fromField: 'parent_id', toTable: 'infrastructure_nodes', toField: 'id' },
  { fromTable: 'infrastructure_nodes', fromField: 'linked_sibling_id', toTable: 'infrastructure_nodes', toField: 'id' },
];