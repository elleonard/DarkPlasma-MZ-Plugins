import { z } from 'zod';

const stringOrI18nString = z.union([z.string(), z.record(z.string())]);

const pluginParameterBase = z.object({
  parent: z.string().optional(),
  param: z.string(),
  text: stringOrI18nString,
  description: stringOrI18nString.optional(),
});

const pluginParameterDummy = pluginParameterBase.extend({
  type: z.literal('dummy'),
  default: z.any(),
});

const pluginParameterString = pluginParameterBase.extend({
  type: z.literal('string'),
  default: stringOrI18nString.default(''),
});

const pluginParameterStringArray = pluginParameterBase.extend({
  type: z.literal('string[]'),
  default: z.array(stringOrI18nString).default([]),
});

const pluginParameterMultilineString = pluginParameterBase.extend({
  type: z.literal('multiline_string'),
  default: stringOrI18nString.default(''),
});

const pluginParameterMultilineStringArray = pluginParameterBase.extend({
  type: z.literal('multiline_string[]'),
  default: z.array(stringOrI18nString).default([]),
});

const pluginParameterFile = pluginParameterBase.extend({
  type: z.literal('file'),
  dir: z.string(),
  default: z.string().default(''),
});

const pluginParameterFileArray = pluginParameterFile.extend({
  type: z.literal('file[]'),
  default: z.array(z.string()).default([]),
});

const pluginParameterNumber = pluginParameterBase.extend({
  type: z.literal('number'),
  max: z.number().optional(),
  min: z.number().optional(),
  decimals: z.number().min(0).optional(),
  default: z.number().default(0),
});

const pluginParameterNumberArray = pluginParameterNumber.extend({
  type: z.literal('number[]'),
  default: z.array(z.number()).default([]),
});

const pluginParameterBoolean = pluginParameterBase.extend({
  type: z.literal('boolean'),
  default: z.boolean(),
});

const pluginParameterBooleanArray = pluginParameterBase.extend({
  type: z.literal('boolean[]'),
  default: z.array(z.boolean()).default([]),
});

const pluginParameterSelect = pluginParameterBase.extend({
  type: z.literal('select'),
  options: z.array(
    z.object({
      name: stringOrI18nString,
      value: z.union([z.string(), z.number()]).optional(),
    }),
  ),
  default: z.union([z.string(), z.number()]),
});

const pluginParameterSelectArray = pluginParameterSelect.extend({
  type: z.literal('select[]'),
  default: z.array(z.union([z.string(), z.number()])).default([]),
});

export const databaseType = z.union([
  z.literal('actor'),
  z.literal('class'),
  z.literal('skill'),
  z.literal('item'),
  z.literal('weapon'),
  z.literal('armor'),
  z.literal('enemy'),
  z.literal('troop'),
  z.literal('state'),
  z.literal('animation'),
  z.literal('tileset'),
  z.literal('common_event'),
  z.literal('switch'),
  z.literal('variable'),
]);

const pluginParameterDatabase = pluginParameterBase.extend({
  type: databaseType,
  default: z.number().default(0),
});

export const databaseArrayType = z.union([
  z.literal('actor[]'),
  z.literal('class[]'),
  z.literal('skill[]'),
  z.literal('item[]'),
  z.literal('weapon[]'),
  z.literal('armor[]'),
  z.literal('enemy[]'),
  z.literal('troop[]'),
  z.literal('state[]'),
  z.literal('animation[]'),
  z.literal('tileset[]'),
  z.literal('common_event[]'),
  z.literal('switch[]'),
  z.literal('variable[]'),
]);

const pluginParameterDatabaseArray = pluginParameterBase.extend({
  type: databaseArrayType,
  default: z.array(z.number()).default([]),
});

const pluginParameterColor = pluginParameterBase.extend({
  type: z.literal('color'),
  default: z.number().default(0),
});

const pluginParameterColorArray = pluginParameterBase.extend({
  type: z.literal('color[]'),
  default: z.array(z.number()).default([]),
});

const pluginParameterIcon = pluginParameterBase.extend({
  type: z.literal('icon'),
  default: z.number().default(0),
});

const pluginParameterIconArray = pluginParameterBase.extend({
  type: z.literal('icon[]'),
  default: z.array(z.number()).default([]),
});

const structOrI18nStruct = z.union([z.record(z.any()), z.record(z.record(z.any()))]);

const pluginParameterStruct = pluginParameterBase.extend({
  type: z.literal('struct'),
  struct: z.string(),
  default: structOrI18nStruct.default({}),
});

export const structArrayOrI18nStructArray = z.union([z.array(z.record(z.any())), z.record(z.array(z.record(z.any())))]);
export type StructArrayOrI18nStructArray = z.infer<typeof structArrayOrI18nStructArray>;

const pluginParameterStructArray = pluginParameterStruct.extend({
  type: z.literal('struct[]'),
  default: structArrayOrI18nStructArray.default([]),
});

const pluginParameter = z.union([
  pluginParameterDummy,
  pluginParameterString,
  pluginParameterStringArray,
  pluginParameterMultilineString,
  pluginParameterMultilineStringArray,
  pluginParameterFile,
  pluginParameterFileArray,
  pluginParameterNumber,
  pluginParameterNumberArray,
  pluginParameterBoolean,
  pluginParameterBooleanArray,
  pluginParameterSelect,
  pluginParameterSelectArray,
  pluginParameterDatabase,
  pluginParameterDatabaseArray,
  pluginParameterStruct,
  pluginParameterStructArray,
  pluginParameterColor,
  pluginParameterColorArray,
  pluginParameterIcon,
  pluginParameterIconArray,
]);

export const pluginParameterArray = z.union([
  pluginParameterStringArray,
  pluginParameterMultilineStringArray,
  pluginParameterFileArray,
  pluginParameterNumberArray,
  pluginParameterBooleanArray,
  pluginParameterSelectArray,
  pluginParameterDatabaseArray,
  pluginParameterStructArray,
  pluginParameterColorArray,
  pluginParameterIconArray,
]);

const pluginStruct = z.object({
  name: z.string(),
  params: z.array(pluginParameter),
});

export type PluginStruct = z.infer<typeof pluginStruct>;

export type StructDefaultValueType<T extends PluginStruct['params']> = {
  [P in T[number] as P['param']]: P['default'];
};

const pluginCommand = z.object({
  command: z.string(),
  text: stringOrI18nString,
  description: stringOrI18nString.optional(),
  args: z.array(pluginParameter).default([]),
});

const pluginNote = z.object({
  param: z.string(),
  dir: z.string(),
  data: z.union([
    z.literal('maps'),
    z.literal('events'),
    z.literal('actors'),
    z.literal('classes'),
    z.literal('skills'),
    z.literal('items'),
    z.literal('weapons'),
    z.literal('armors'),
    z.literal('enemies'),
    z.literal('states'),
    z.literal('tilesets'),
  ]),
});

const pluginHistory = z.object({
  date: z.string().optional(),
  version: z.string().optional(),
  description: z.string(),
});

export const pluginLocate = z.union([
  z.literal('ja'),
  z.literal('en'),
  z.literal('ko'),
  z.literal('zh'),
]);

export type I18nText = {
  ja: string;
  en?: string;
  ko?: string;
  zh?: string;
};

const pluginDependency = z.object({
  name: z.string(),
  version: z.string().optional(),
  base: z.boolean().optional(),
  order: z.union([
    z.literal('after'),
    z.literal('before'),
  ]).optional(),
});

const pluginDependencies = z.object({
  base: z.array(pluginDependency).default([]),
  orderAfter: z.array(pluginDependency).default([]),
  orderBefore: z.array(pluginDependency).default([]),
});

export const pluginConfigSchema = z.object({
  name: z.string(),
  year: z.number(),
  author: z.string().default('DarkPlasma').optional(),
  license: z.string(),
  histories: z.array(pluginHistory),
  deprecated: z.boolean().default(false).optional(),
  locates: z.array(pluginLocate),
  plugindesc: stringOrI18nString,
  parameters: z.array(pluginParameter).default([]),
  commands: z.array(pluginCommand).default([]),
  structures: z.array(pluginStruct).default([]),
  notes: z.array(pluginNote).default([]).optional(),
  dependencies: pluginDependencies,
  help: stringOrI18nString,
});

export type DatabaseType = z.infer<typeof databaseType>;
export type DatabaseArrayType = z.infer<typeof databaseArrayType>;

export type PluginLocateSchema = z.infer<typeof pluginLocate>;
export type PluginDependencySchema = z.infer<typeof pluginDependency>;
export type PluginDependenciesSchema = z.infer<typeof pluginDependencies>;
export type PluginHistorySchema = z.infer<typeof pluginHistory>;

export type PluginParameterSchema = z.infer<typeof pluginParameter>;
export type PluginParameterDummySchema = z.infer<typeof pluginParameterDummy>;
export type PluginParameterStringSchema = z.infer<typeof pluginParameterString>;
export type PluginParameterStringArraySchema = z.infer<typeof pluginParameterStringArray>;
export type PluginParameterMultilineStringSchema = z.infer<typeof pluginParameterMultilineString>;
export type PluginParameterMultilineStringArraySchema = z.infer<typeof pluginParameterMultilineStringArray>;
export type PluginParameterFileSchema = z.infer<typeof pluginParameterFile>;
export type PluginParameterFileArraySchema = z.infer<typeof pluginParameterFileArray>;
export type PluginParameterNumberSchema = z.infer<typeof pluginParameterNumber>;
export type PluginParameterNumberArraySchema = z.infer<typeof pluginParameterNumberArray>;
export type PluginParameterBooleanSchema = z.infer<typeof pluginParameterBoolean>;
export type PluginParameterBooleanArraySchema = z.infer<typeof pluginParameterBooleanArray>;
export type PluginParameterSelectSchema = z.infer<typeof pluginParameterSelect>;
export type PluginParameterSelectArraySchema = z.infer<typeof pluginParameterSelectArray>;
export type PluginParameterDatabaseSchema = z.infer<typeof pluginParameterDatabase>;
export type PluginParameterDatabaseArraySchema = z.infer<typeof pluginParameterDatabaseArray>;
export type PluginParameterColorSchema = z.infer<typeof pluginParameterColor>;
export type PluginParameterColorArraySchema = z.infer<typeof pluginParameterColorArray>;
export type PluginParameterIconSchema = z.infer<typeof pluginParameterIcon>;
export type PluginParameterIconArraySchema = z.infer<typeof pluginParameterIconArray>;
export type PluginParameterStructSchema = z.infer<typeof pluginParameterStruct>;
export type PluginParameterStructArraySchema = z.infer<typeof pluginParameterStructArray>;

export type PluginParameterArraySchema = z.infer<typeof pluginParameterArray>;

export type PluginCommandSchema = z.infer<typeof pluginCommand>;
export type PluginConfigSchema = z.infer<typeof pluginConfigSchema>;
