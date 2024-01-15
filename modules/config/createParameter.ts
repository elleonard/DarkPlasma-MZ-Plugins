import { DatabaseType, I18nText, PluginCommandSchema, PluginParameterBooleanArraySchema, PluginParameterBooleanSchema, PluginParameterColorArraySchema, PluginParameterColorSchema, PluginParameterDatabaseArraySchema, PluginParameterDatabaseSchema, PluginParameterDummySchema, PluginParameterFileArraySchema, PluginParameterFileSchema, PluginParameterIconArraySchema, PluginParameterIconSchema, PluginParameterMultilineStringArraySchema, PluginParameterMultilineStringSchema, PluginParameterNumberArraySchema, PluginParameterNumberSchema, PluginParameterSchema, PluginParameterSelectArraySchema, PluginParameterSelectSchema, PluginParameterStringArraySchema, PluginParameterStringSchema, PluginParameterStructArraySchema, PluginParameterStructSchema, PluginStruct, StructDefaultValueType } from "./configSchema.js";

export function createStruct<T extends string, U extends PluginParameterSchema[]>(
  name: T,
  params: U
): {
  name: T;
  params: U;
} {
  return { name, params };
}

export function createDummyParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText
  }
): PluginParameterDummySchema & { param: T } {
  return {
    param: name,
    type: 'dummy',
    text: props.text,
  };
}

export function createStringParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: string | I18nText;
    parent?: string;
  }
): PluginParameterStringSchema & {
  param: T
} {
  return {
    param: name,
    type: 'string',
    text: props.text,
    description: props.description,
    default: props.default || '',
    parent: props.parent,
  };
}

export function createStringArrayParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: string[];
    parent?: string;
  }
): PluginParameterStringArraySchema & { param: T } {
  return {
    param: name,
    type: 'string[]',
    text: props.text,
    description: props.description,
    default: props.default || [],
    parent: props.parent,
  };
}

export function createMultilineStringParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: string | I18nText;
    parent?: string;
  }
): PluginParameterMultilineStringSchema & { param: T } {
  return {
    param: name,
    type: "multiline_string",
    text: props.text,
    description: props.description,
    default: props.default || "",
    parent: props.parent,
  };
}

export function createMultilineStringArrayParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: string[] | I18nText[];
    parent?: string;
  }
): PluginParameterMultilineStringArraySchema & { param: T } {
  return {
    param: name,
    type: 'multiline_string[]',
    text: props.text,
    description: props.description,
    default: props.default || [],
    parent: props.parent,
  };
}

export function createFileParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    dir: string;
    default?: string;
    parent?: string;
  }
): PluginParameterFileSchema & { param: T } {
  return {
    param: name,
    type: 'file',
    text: props.text,
    description: props.description,
    dir: props.dir,
    default: props.default || "",
    parent: props.parent,
  };
}

export function createFileArrayParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    dir: string;
    default?: string[];
    parent?: string;
  }
): PluginParameterFileArraySchema & { param: T } {
  return {
    param: name,
    type: 'file[]',
    text: props.text,
    description: props.description,
    dir: props.dir,
    default: props.default || [],
    parent: props.parent,
  };
}

export function createNumberParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText,
    description?: string | I18nText,
    min?: number,
    max?: number;
    decimals?: number;
    default?: number;
    parent?: string;
  }
): PluginParameterNumberSchema & {
  param: T
} {
  return {
    param: name,
    type: 'number',
    text: props.text,
    description: props.description,
    min: props.min,
    max: props.max,
    decimals: props.decimals || 0,
    default: props.default || 0,
    parent: props.parent,
  };
}

export function createNumberArrayParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: number[];
    parent?: string;
  }
): PluginParameterNumberArraySchema & { param: T } {
  return {
    param: name,
    type: 'number[]',
    text: props.text,
    description: props.description,
    default: props.default || [],
    parent: props.parent,
  };
}

export function createBooleanParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default: boolean;
    parent?: string;
  }
): PluginParameterBooleanSchema & {
  param: T
} {
  return {
    param: name,
    type: 'boolean',
    text: props.text,
    description: props.description,
    default: props.default,
    parent: props.parent,
  };
}

export function createBooleanArrayParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: boolean[];
  }
): PluginParameterBooleanArraySchema & { param: T } {
  return {
    param: name,
    type: 'boolean[]',
    text: props.text,
    description: props.description,
    default: props.default || [],
  };
}

export function createSelectParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default: number | string;
    options: {
      name: string | I18nText;
      value?: string | number;
    }[],
    parent?: string;
  }
): PluginParameterSelectSchema & {
  param: T
} {
  return {
    param: name,
    type: 'select',
    text: props.text,
    description: props.description,
    default: props.default,
    options: props.options,
    parent: props.parent,
  };
}

export function createSelectArrayParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    options: {
      name: string;
      value?: number | string;
    }[];
    default?: number[] | string[];
    parent?: string;
  }
): PluginParameterSelectArraySchema & { param: T } {
  return {
    param: name,
    type: 'select[]',
    text: props.text,
    description: props.description,
    options: props.options,
    default: props.default || [],
    parent: props.parent,
  };
}

export function createDatabaseParam<T extends string>(
  name: T,
  props: {
    type: DatabaseType;
    text: string | I18nText;
    description?: string | I18nText;
    default?: number;
    parent?: string;
  }
): PluginParameterDatabaseSchema & {
  param: T
} {
  return {
    param: name,
    type: props.type,
    text: props.text,
    description: props.description,
    default: props.default || 0,
    parent: props.parent,
  };
}

export function createDatabaseArrayParam<T extends string>(
  name: T,
  props: {
    type: DatabaseType;
    text: string | I18nText;
    description?: string | I18nText;
    default?: number[];
    parent?: string;
  }
): PluginParameterDatabaseArraySchema & {
  param: T
} {
  return {
    param: name,
    type: `${props.type}[]`,
    text: props.text,
    description: props.description,
    default: props.default || [],
    parent: props.parent,
  };
}

export function createColorParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: number;
    parent?: string;
  }
): PluginParameterColorSchema & { param: T } {
  return {
    param: name,
    type: 'color',
    text: props.text,
    description: props.description,
    default: props.default || 0,
    parent: props.parent,
  };
}

export function createColorArrayParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: number[];
    parent?: string;
  }
): PluginParameterColorArraySchema & { param: T } {
  return {
    param: name,
    type: 'color[]',
    text: props.text,
    description: props.description,
    default: props.default || [],
    parent: props.parent,
  };
}

export function createIconParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: number;
    parent?: string;
  }
): PluginParameterIconSchema & { param: T } {
  return {
    param: name,
    type: 'icon',
    text: props.text,
    description: props.description,
    default: props.default || 0,
    parent: props.parent,
  };
}

export function createIconArrayParam<T extends string>(
  name: T,
  props: {
    text: string | I18nText;
    description?: string | I18nText;
    default?: number[];
    parent?: string;
  }
): PluginParameterIconArraySchema & { param: T } {
  return {
    param: name,
    type: 'icon[]',
    text: props.text,
    description: props.description,
    default: props.default || [],
    parent: props.parent,
  };
}

export function createStructParam<T extends string, U extends PluginStruct>(
  name: T,
  props: {
    struct: U;
    text: string | I18nText,
    description?: string | I18nText,
    default?: StructDefaultValueType<U['params']>;
    parent?: string;
  }
): PluginParameterStructSchema & {
  param: T
} {
  return {
    param: name,
    type: 'struct',
    struct: props.struct.name,
    text: props.text,
    description: props.description,
    default: props.default || getStructDefaultValue(props.struct),
    parent: props.parent,
  };
}

export function createStructArrayParam<T extends string, U extends PluginStruct>(
  name: T,
  props: {
    struct: U;
    text: string | I18nText;
    description?: string | I18nText;
    default?: StructDefaultValueType<U['params']>[];
    parent?: string;
  }
): PluginParameterStructArraySchema & { param: T } {
  return {
    param: name,
    type: 'struct[]',
    struct: props.struct.name,
    text: props.text,
    description: props.description,
    default: props.default || [],
    parent: props.parent,
  };
}

function getStructDefaultValue<T extends PluginStruct>(struct: T): StructDefaultValueType<T['params']> {
  const result: any = {};
  struct.params.forEach(param => result[param.param] = param.default);
  return result;
}

export function createCommand<T extends string>(
  name: T,
  props: {
    text: string | I18nText,
    description?: string | I18nText,
    args?: PluginParameterSchema[]
  }
): PluginCommandSchema & { command: T } {
  return {
    command: name,
    text: props.text,
    description: props.description,
    args: props.args || [],
  };
}
