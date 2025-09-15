import { PluginCommandSchema, PluginConfigSchema, PluginDependenciesSchema, PluginHistorySchema, PluginLocateSchema, PluginParameterSchema, pluginLocate } from "../../modules/config/configSchema.js";

export function generateHeader(config: PluginConfigSchema) {
  const topComments = generateTopComments(
    config.name,
    pluginVersion(config),
    config.year,
    config.license
  );
  const histories = generateHistories(config.histories);
  const main = generateHeaderMain(config);
  
  return [topComments, histories, main].join('\n\n');
}

function generateTopComments(pluginName: string, version: string, year: number, license: string): string {
  const result = [`// ${pluginName} ${version}`, `// Copyright (c) ${year} DarkPlasma`];
  /**
   * MIT以外の場合は No License 扱いとしている
   */
  if (license === 'MIT') {
    return result
      .concat([
        `// This software is released under the MIT license.`,
        `// http://opensource.org/licenses/mit-license.php`,
      ])
      .join('\n');
  }
  return result.join('\n');
}

function generateHistories(histories: PluginHistorySchema[]) {
  let lastWritternDate = '';
  let lastWritternVersion = '';
  return ['/**']
    .concat(
      histories.map((history) => {
        let date = history.date;
        let version = history.version;
        if (!history.date) {
          date = ''.padStart(lastWritternDate.length, ' ');
        } else {
          lastWritternDate = history.date;
        }
        if (!history.version) {
          version = ''.padStart(lastWritternVersion.length, ' ');
        } else {
          lastWritternVersion = history.version;
        }
        return ` * ${date} ${version} ${history.description}`;
      })
    )
    .concat([' */'])
    .join('\n');
}

function generateHeaderMain(config: PluginConfigSchema) {
  /**
   * baseに定義したorderを見て@orderAfter,@orderBeforeの設定を追加
   */
  config.dependencies.base
    .filter(baseDependency => baseDependency.order === "after" && config.dependencies.orderAfter.every(d => d.name !== baseDependency.name))
    .forEach(dependency => config.dependencies.orderAfter.push(dependency));
  config.dependencies.base
    .filter(baseDependency => baseDependency.order === "before" && config.dependencies.orderBefore.every(d => d.name !== baseDependency.name))
    .forEach(dependency => config.dependencies.orderBefore.push(dependency));
  return config.locates.sort((a, b) => a === "ja" ? 1 : b === "ja" ? -1 : 0)
    .map((language, index) => {
      const dependenciesText = config.dependencies
        ? (<T extends { [key: string]: unknown }>(obj: T): (keyof T)[] => {
          return Object.keys(config.dependencies);
        })(config.dependencies)
          .filter(key => !!config.dependencies[key])
          .map((key) => {
            if (Array.isArray(config.dependencies[key])) {
              if (config.dependencies[key].length === 0) {
                return '';
              }
              return config.dependencies[key].map((plugin) => ` * @${key} ${plugin.name}`).join('\n');
            }
            return ` * @${key} ${config.dependencies[key]}`;
          })
          .filter((line) => line !== '')
          .join('\n')
        : '';
      const structureTypes = config.structures.map(structure => structure.name);
      const parametersText: string = config.parameters
        .map((parameter) => generateParameterText(parameter, language, "param"))
        .join('\n *\n');
      const noteText = config.notes
        ? config.notes.map((note) => {
          return [
            ` * @noteParam ${note.param}`,
            ` * @noteDir ${note.dir}`,
            ` * @noteType file`,
            ` * @noteData ${note.data}`,
          ].join('\n');
        })
        : '';
      const commandsText = config.commands
        ? config.commands
          .map((command) => generateCommandText(command, language))
          .join('\n *\n')
        : '';
      const deprecatedText = config.deprecated ? "\n * @deprecated\n" : "";
      const structuresText = generateStructuresText(config, structureTypes, language);

      return `${[generatePluginMetaText(config, language)]
        .concat(dependenciesText)
        .concat(parametersText)
        .concat(noteText)
        .concat(commandsText)
        .concat(deprecatedText)
        .concat([
          [` * @help`]
            .concat(generateHelp(
              typeof config.help === "string" ? config.help : config.help[language],
              pluginVersion(config),
              config.dependencies,
              language
            ))
            .concat([' */'])
            .join('\n'),
        ])
        .filter((array) => array.length > 0)
        .join('\n *\n')}\n${structuresText}`;
    })
    .join('\n');
}

function generatePluginMetaText(config: PluginConfigSchema, language: PluginLocateSchema) {
  const result = [
    `/*:${isDefaultLanguage(language) ? "" : language}`,
    ` * @plugindesc ${typeof config.plugindesc === "string" ? config.plugindesc : config.plugindesc[language]}`,
    ` * @author ${config.author || "DarkPlasma"}`,
    ` * @license ${config.license}`,
    ` *`,
    ` * @target MZ`,
  ];
  /**
   * 公開しているプラグインはMITのみ
   */
  if (config.license === 'MIT') {
    return result.concat([` * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release`]).join('\n');
  }
  return result.join('\n');
}

function generateHelp(
  help: string,
  version: string,
  dependencies: PluginDependenciesSchema,
  language: PluginLocateSchema
) {
  const dependencyLines = (<T extends { [key: string]: unknown }>(obj: T): (keyof T)[] => {
    return Object.keys(dependencies);
  })(dependencies).map((key) => {
    if (dependencies[key].length === 0) {
      return [];
    }
    const result = [dependencyText(key, language)];
    dependencies[key]
      .map((plugin) => `${plugin.name}${key === "base" && plugin.version ? ` version:${plugin.version}` : ''}`)
      .forEach((line) => result.push(line));
    return result;
  })
    .flat();
  const helpLines = [`version: ${version}`].concat(help.split('\n')).concat(['']).concat(dependencyLines);
  const length = dependencyLines.length === 0 ? helpLines.length - 1 : helpLines.length;
  return helpLines.slice(0, length).map((line) => ` *${line ? ' ' : ''}${line}`);
}

/**
 * TODO: 各言語への翻訳
 */
function dependencyText(
  key: "base" | "orderAfter" | "orderBefore",
  language: PluginLocateSchema
): string {
  switch (language) {
    case 'ja':
    switch (key) {
      case 'base':
        return '本プラグインの利用には下記プラグインを必要とします。';
      case 'orderAfter':
        return '下記プラグインと共に利用する場合、それよりも下に追加してください。';
      case 'orderBefore':
        return '下記プラグインと共に利用する場合、それよりも上に追加してください。';
    }
    case 'en':
      switch (key) {
        case 'base':
          return 'This plugin requires the following plugin:';
        case 'orderAfter':
          return 'If you use this plugin with the followings, you must order this plugin after them.';
        case 'orderBefore':
          return 'If you use this plugin with the followings, you must order this plugin before them.';
      }
    case 'ko':
      return 'TODO';
    case 'zh':
      return 'TODO';
  }
}

function pluginVersion(config: PluginConfigSchema) {
  return config.histories[0].version || "1.0.0";
}

function generateParameterText(
  parameter: PluginParameterSchema, language: PluginLocateSchema, paramOrArg: "param"|"arg"
) {
  const result = [` * @${paramOrArg} ${parameter.param}`];
  if (parameter.description) {
    if (typeof parameter.description === "string") {
      result.push(` * @desc ${parameter.description}`);
    } else {
      result.push(` * @desc ${parameter.description[language]}`);
    }
  }
  if (typeof parameter.text === "string") {
    result.push(` * @text ${parameter.text}`);
  } else {
    result.push(` * @text ${parameter.text[language]}`);
  }
  if (parameter.type !== 'dummy') {
    result.push(` * @type ${parameterTypeText(parameter, language)}`);
  }
  /**
   * TODO: 型ごとの追加アノテーションを整理する
   */
  if ((parameter.type === 'select' || parameter.type === 'select[]') && parameter.options) {
    parameter.options.forEach((option) => {
      result.push(` * @option ${option.name}`);
      if (option.value || Number.isFinite(option.value)) {
        result.push(` * @value ${option.value}`);
      }
    });
  } else if (parameter.type === 'number' && parameter.decimals) {
    result.push(` * @decimals ${parameter.decimals}`);
  }
  (() => {
    const result = [];
    if (parameter.parent) {
      result.push({ key: 'parent', value: parameter.parent });
    }
    if (parameter.type === "number") {
      if (parameter.max) {
        result.push({ key: 'max', value: parameter.max });
      }
      if (parameter.min) {
        result.push({ key: 'min', value: parameter.min });
      }
    }
    if (parameter.type === "file" || parameter.type === "file[]") {
      result.push({ key: 'dir', value: parameter.dir });
    }
    return result;
  })()
    .forEach((annotation) => {
      result.push(` * @${annotation.key} ${annotation.value}`);
    });
  const default_ = defaultParameterText(parameter, language);
  if (default_ || typeof default_ === 'boolean' || Number.isFinite(default_)) {
    result.push(` * @default ${default_}`.replace(/\n/g, '\\n'));
  }
  return result.join('\n');
}

function generateCommandText(command: PluginCommandSchema, language: PluginLocateSchema) {
  const result = [` * @command ${command.command}`];
  result.push(` * @text ${typeof command.text === "string" ? command.text : command.text[language]}`);
  if (command.description) {
    result.push(` * @desc ${typeof command.description === "string" ? command.description : command.description[language]}`);
  }
  if (command.args) {
    command.args.forEach((arg) => {
      result.push(generateParameterText(arg, language, "arg"));
    });
  }
  return result.join('\n');
}

function parameterTypeText(parameter: PluginParameterSchema, language: PluginLocateSchema) {
  if (parameter.type === "struct") {
    return `struct<${languageSuffixedType(parameter.struct, language)}>`;
  } else if(parameter.type === "struct[]") {
    return `struct<${languageSuffixedType(parameter.struct, language)}>[]`;
  }
  return parameter.type;
}

function languageSuffixedType(type: string, language: PluginLocateSchema) {
  if (!isDefaultLanguage(language)) {
    const suffix = `${language.substring(0, 1).toUpperCase()}${language.substring(1)}`;
    return `${type}${suffix}`;
  }
  return type;
}

function defaultParameterText(parameter: PluginParameterSchema, language: PluginLocateSchema) {
  switch (parameter.type) {
    case "string":
    case "multiline_string":
      return typeof parameter.default === "string" ? parameter.default : parameter.default[language];
    case "string[]":
    case "multiline_string[]":
      return Array.isArray(parameter.default)
        ? JSON.stringify(parameter.default) : JSON.stringify(parameter.default[language]);
    case "number":
    case "number[]":
    case "boolean":
    case "boolean[]":
    case "file[]":
    case "select[]":
    case "file[]":
    case "select[]":
    case "actor[]":
    case "class[]":
    case "skill[]":
    case "item[]":
    case "weapon[]":
    case "armor[]":
    case "enemy[]":
    case "troop[]":
    case "state[]":
    case "animation[]":
    case "tileset[]":
    case "common_event[]":
    case "switch[]":
    case "variable[]":
    case "color[]":
    case "icon[]":
      return JSON.stringify(parameter.default);
    case "file":
    case "select":
    case "actor":
    case "class":
    case "skill":
    case "item":
    case "weapon":
    case "armor":
    case "enemy":
    case "troop":
    case "state":
    case "animation":
    case "tileset":
    case "common_event":
    case "switch":
    case "variable":
    case "color":
    case "icon":
      return String(parameter.default);
    case "struct":
      return escapeStructParam(pickObject(parameter.default, language));
    case "struct[]":
      return Array.isArray(parameter.default)
        ? JSON.stringify(parameter.default.map(p => escapeStructParam(pickObject(p, language))))
        : JSON.stringify(pickObject(parameter.default, language)
          .map((p: Record<string, any>) => escapeStructParam(pickObject(p, language))));
  }
}

function pickObject<T extends { [key: string]: any }>(value: T | { [key: string]: T }, language: PluginLocateSchema) {
  const keys = Object.keys(value);
  if (keys.length > 0 && keys.every((key) => pluginLocate.options.some(l => l.value === key))) {
    return value[language];
  } else {
    return value;
  }
}

function escapeStructParam(param: { [key: string]: any }) {
  const result: { [key: string]: string } = {};

  for (const key in param) {
    const value = param[key];
    if (Array.isArray(value)) {
      result[key] = JSON.stringify(value.map((n) => escapeStructParam(n)));
    } else if (typeof value === 'object') {
      result[key] = escapeStructParam(value);
    } else {
      result[key] = String(value);
    }
  }

  return JSON.stringify(result);
}

function generateStructuresText(config: PluginConfigSchema, structureTypes: string[], language: PluginLocateSchema) {
  const result = Array.from(new Set(structureTypes))
    .map((structureType) => {
      return generateStructureText(config, structureType, language);
    })
    .join('\n');
  return result;
}

function generateStructureText(config: PluginConfigSchema, type: string, language: PluginLocateSchema) {
  const structure = config.structures.find(structure => structure.name === type);
  if (!structure) throw `unknown structure: ${type}`;
  return `/*~struct~${languageSuffixedType(type, language)}:
${structure.params
  .map((parameter) => generateParameterText(parameter, language, "param"))
  .join('\n *\n')}
 */`;
}

function isDefaultLanguage(language: PluginLocateSchema) {
  return 'ja' === language;
}
