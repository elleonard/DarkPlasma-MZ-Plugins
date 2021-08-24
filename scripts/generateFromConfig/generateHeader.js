class TypedParameter {
  type() {
    return '';
  }

  isDummy() {
    return false;
  }

  baseType() {
    if (this.isDummy()) {
      return '';
    }
    return this.isArray() ? this.type().substring(0, this.type().length - 2) : this.type();
  }

  /**
   * 構造体の型名は日本語の場合以外、末尾にEnなどとつける
   * 構造体メンバの説明文やデフォルト値を分岐する手段が今のところこれしかない
   * @param {string} language 言語
   * @return {string}
   */
  languageSuffixedType(language) {
    if (language !== 'ja' && this.isStructure()) {
      const suffix = `${language.substring(0, 1).toUpperCase()}${language.substring(1)}`;
      return `${this.baseType()}${suffix}`;
    }
    return this.baseType();
  }

  isBasicType() {
    return (
      !this.isDummy() &&
      [
        'string',
        'multiline_string',
        'number',
        'boolean',
        'select',
        'actor',
        'class',
        'enemy',
        'skill',
        'item',
        'weapon',
        'armor',
        'animation',
        'state',
        'switch',
        'variable',
        'common_event',
        'file',
      ].includes(this.baseType())
    );
  }

  isArray() {
    return !this.isDummy() && this.type().endsWith('[]');
  }

  isStructure() {
    return !this.isDummy() && !this.isBasicType();
  }

  /**
   * @param {string} language 言語
   * @return {string}
   */
  typeText(language) {
    return `${this.isStructure() ? `struct<${this.languageSuffixedType(language)}>` : this.baseType()}${
      this.isArray() ? '[]' : ''
    }`;
  }
}

class PluginParameter extends TypedParameter {
  constructor(parameter) {
    super();
    this._parameter = parameter;
  }

  type() {
    return this._parameter.type;
  }

  /**
   * parentアノテーション用ダミーフラグ
   * @return {boolean}
   */
  isDummy() {
    return !!this._parameter.dummy;
  }

  defaultValue(language) {
    if (this._parameter.default === undefined || this._parameter.default === null) {
      return '';
    }
    if (typeof this._parameter.default === 'boolean' || Number.isFinite(this._parameter.default)) {
      return this._parameter.default;
    }
    return this._parameter.default[language] ? this._parameter.default[language] : this._parameter.default;
  }

  /**
   * トップコメントやパラメータパース用のデフォルト値を返す
   * トップコメント用は余分なクオートやエスケープが必要なのでやや汚い
   * FIXME: 余分なクオートを取り除くオプションはバグの恐れがある
   * パーサに食わせるのだからトップコメント用と同じエスケープをつけるべき
   * prettierでエスケープが最適化されてしまうので、 singleQuote オプションを切るのが良いだろう
   *
   * @param {string} language 言語
   * @param {boolean} withoutExtraQuotes トップコメント用のクオートを外す（パラメータパースコード用）
   * @return {string}
   */
  defaultText(language, withoutExtraQuotes) {
    const defaultValue = this.defaultValue(language);
    if (defaultValue || typeof defaultValue === 'boolean' || Number.isFinite(defaultValue)) {
      if (Array.isArray(defaultValue)) {
        if (defaultValue.length === 0) {
          return '[]';
        }
        /**
         * 雑判定だが、二重配列のパラメータはサポートしないのでこれで良い
         */
        if (typeof defaultValue[0] === 'object') {
          const result = `[${defaultValue
            .map((defaultValue) => {
              const objectKeyValue = this.escapeDoubleQuote(
                Object.entries(defaultValue)
                  .map(([key, value]) => {
                    return this.defaultObjectKeyValueToText(key, value, withoutExtraQuotes);
                  })
                  .join(',')
              );
              return withoutExtraQuotes ? `{${objectKeyValue}}` : `"{${objectKeyValue}}"`;
            })
            .join(',')}]`;
          return result;
        }
        return `[${defaultValue.map((value) => `"${value}"`).join(', ')}]`;
      }
      if (typeof defaultValue === 'object') {
        return `{${Object.entries(defaultValue)
          .map(([key, value]) => {
            return this.defaultObjectKeyValueToText(key, value, withoutExtraQuotes);
          })
          .join(', ')}}`;
      }
      return defaultValue;
    }
    return '';
  }

  defaultObjectKeyValueToText(key, value, withoutExtraQuotes) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return `"${key}":${withoutExtraQuotes ? '[]' : '"[]"'}`;
      }
      if (typeof value[0] === 'object') {
        const objectKeyValue = Object.entries(value)
          .map(([k, v]) => {
            return this.defaultObjectKeyValueToText(k, v);
          })
          .join(', ');
        return `"${key}":${withoutExtraQuotes ? `{${objectKeyValue}}` : `"{${objectKeyValue}}"`}`;
      }
      return `"${key}":${
        withoutExtraQuotes ? `[${value.map((v) => `"${v}"`).join(',')}]` : `"[${value.map((v) => `"${v}"`).join(',')}]"`
      }`;
    }
    if (value && typeof value === 'object') {
      const objectKeyValue = this.escapeDoubleQuote(
        Object.entries(value)
          .map(([k, v]) => {
            return this.defaultObjectKeyValueToText(k, v);
          })
          .join(', ')
      );
      return `"${key}":${withoutExtraQuotes ? `{${objectKeyValue}}` : `"{${objectKeyValue}}"`}`;
    }
    return `"${key}":"${value}"`;
  }

  /**
   * エスケープが必要なダブルクォートをエスケープする
   * @param {string} string 対象文字列
   * @return {string}
   */
  escapeDoubleQuote(string) {
    return string.replace(/"/g, '\\"');
  }

  toParameterText(language) {
    const result = [` * @param ${this._parameter.param}`];
    if (this._parameter.desc && this._parameter.desc[language]) {
      result.push(` * @desc ${this._parameter.desc[language]}`);
    }
    if (this._parameter.text && this._parameter.text[language]) {
      result.push(` * @text ${this._parameter.text[language]}`);
    }
    /**
     * parentアノテーション用ダミーフラグ
     */
    if (!this._parameter.dummy) {
      result.push(` * @type ${this.typeText(language)}`);
      if (this._parameter.type === 'select' && this._parameter.options) {
        this._parameter.options.forEach((option) => {
          result.push(` * @option ${option.name}`);
          if (option.value || Number.isFinite(option.value)) {
            result.push(` * @value ${option.value}`);
          }
        });
      } else if (this._parameter.type === 'number' && this._parameter.decimals) {
        result.push(` * @decimals ${this._parameter.decimals}`);
      }
      const default_ = this.defaultText(language);
      if (default_ || typeof default_ === 'boolean' || Number.isFinite(default_)) {
        result.push(` * @default ${default_}`);
      }
    }
    ['parent', 'min', 'max', 'dir']
      .filter((annotation) => {
        return !!this._parameter[annotation];
      })
      .forEach((annotation) => {
        result.push(` * @${annotation} ${this._parameter[annotation]}`);
      });
    return result.join('\n');
  }
}

class PluginCommandArgument extends TypedParameter {
  constructor(argument) {
    super();
    this._argument = argument;
  }

  type() {
    return this._argument.type;
  }

  toArgumentText(language) {
    const result = [` * @arg ${this._argument.arg}`];
    if (this._argument.text) {
      result.push(` * @text ${this._argument.text[language]}`);
    }
    if (this._argument.desc) {
      result.push(` * @desc ${this._argument.desc[language]}`);
    }
    if (this.type()) {
      result.push(` * @type ${this.typeText(language)}`);
    }
    ['min', 'max']
      .filter((annotation) => {
        return !!this._argument[annotation];
      })
      .forEach((annotation) => {
        result.push(` * @${annotation} ${this._argument[annotation]}`);
      });
    return result.join('\n');
  }
}

class PluginCommand {
  constructor(command) {
    this._command = command;
    this._structureArgumentTypes = [];
  }

  /**
   * 引数の型で構造体であるもの一覧
   * @return {string[]}
   */
  get structureArgumentTypes() {
    return this._structureArgumentTypes.filter((x, i, self) => self.indexOf(x) === i);
  }

  toCommandText(language) {
    const result = [` * @command ${this._command.command}`];
    if (this._command.text) {
      result.push(` * @text ${this._command.text[language]}`);
    }
    if (this._command.desc) {
      result.push(` * @desc ${this._command.desc[language]}`);
    }
    if (this._command.args) {
      this._command.args.forEach((arg) => {
        const argument = new PluginCommandArgument(arg);
        if (argument.isStructure()) {
          this._structureArgumentTypes.push(argument.baseType());
        }
        result.push(argument.toArgumentText(language));
      });
    }
    return result.join('\n');
  }
}

function generateHeader(config) {
  const version = config.histories[0].version;
  const topCommentLine = generateTopComments(config.name, version, config.year, config.license);
  const historyLine = generateHistories(config.histories);

  const description = config.locates
    .map((language, index) => {
      const dependenciesText = config.dependencies
        ? ['base', 'orderAfter', 'orderBefore']
            .filter((key) => config.dependencies[key])
            .map((key) => {
              if (Array.isArray(config.dependencies[key])) {
                return config.dependencies[key].map((plugin) => `* @${key} ${plugin.name}`).join('\n');
              }
              return ` * @${key} ${config.dependencies[key]}`;
            })
            .join('\n')
        : '';
      const structureTypes = [];
      const parametersText = config.parameters
        .map((parameter) => {
          const parameterObject = new PluginParameter(parameter);
          if (parameterObject.isStructure()) {
            const structureType = parameterObject.baseType();
            if (!config.structures || !config.structures[structureType]) throw `unknown structure: ${structureType}`;
            structureTypes.push(structureType);
          }
          return parameterObject.toParameterText(language);
        })
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
            .map((command) => {
              const commandObject = new PluginCommand(command);
              /**
               * toCommandTextで構造体の洗い出しもしているので、先に呼んでおく必要がある
               */
              const commandText = commandObject.toCommandText(language);
              commandObject.structureArgumentTypes.forEach((structureType) => structureTypes.push(structureType));
              return commandText;
            })
            .join('\n *\n')
        : '';
      const structuresText = generateStructuresText(config, structureTypes, structureTypes, language);

      return `${[generatePluginMetaText(config, language)]
        .concat(dependenciesText)
        .concat(parametersText)
        .concat(noteText)
        .concat(commandsText)
        .concat([
          [` * @help`]
            .concat(generateHelp(config.help[language], config.histories[0].version, config.dependencies))
            .concat([' */'])
            .join('\n'),
        ])
        .filter((array) => array.length > 0)
        .join('\n *\n')}\n${structuresText}`;
    })
    .join('\n');

  return [topCommentLine, historyLine, description].join('\n\n');
}

/**
 * @param {string} pluginName プラグイン名
 * @param {string} version バージョン
 * @param {number} year 年
 * @param {string} license ライセンス
 * @return {string[]}
 */
function generateTopComments(pluginName, version, year, license) {
  const result = [`// ${pluginName} ${version}`, `// Copyright (c) ${year} DarkPlasma`];
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

function generateHistories(histories) {
  const writtenDates = [];
  const writtenVersions = [];
  return ['/**']
    .concat(
      histories.map((history) => {
        let date = history.date;
        let version = history.version;
        if (writtenDates.includes(history.date) || !history.date) {
          date = ''.padStart(writtenDates[writtenDates.length - 1].length, ' ');
        } else {
          writtenDates.push(history.date);
        }
        if (writtenVersions.includes(history.version) || !history.version) {
          version = ''.padStart(writtenVersions[writtenVersions.length - 1].length, ' ');
        } else {
          writtenVersions.push(history.version);
        }
        return ` * ${date} ${version} ${history.description}`;
      })
    )
    .concat([' */'])
    .join('\n');
}

/**
 * @param {object} config コンフィグ
 * @param {string} language 言語
 * @return {string}
 */
function generatePluginMetaText(config, language) {
  const result = [
    `/*:${language}`,
    ` * @plugindesc ${config.plugindesc[language]}`,
    ` * @author ${config.author ? config.author : 'DarkPlasma'}`,
    ` * @license ${config.license}`,
    ` *`,
    ` * @target MZ`,
  ];
  if (config.license === 'MIT') {
    return result.concat([` * @url https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release`]).join('\n');
  }
  return result.join('\n');
}

/**
 * ヘルプテキストを行ごとに配列にして返す
 * @param {string} help ヘルプテキスト
 * @param {string} version バージョン
 * @param {{base: string|{ name: string, version: string}[], orderAfter: string|{ name: string, version: string}[], orderBefore: string|{name: string, version: string}[]}} dependencies
 * @return {string{}}
 */
function generateHelp(help, version, dependencies) {
  const helpLines = [`version: ${version}`].concat(help.split('\n')).concat(
    ['base', 'orderAfter', 'orderBefore']
      .map((key) => {
        if (!dependencies || !dependencies[key]) {
          return [];
        }
        const result = [
          key === 'base'
            ? `本プラグインの利用には下記プラグインを必要とします。`
            : `本プラグインを下記プラグインと共に利用できます。`,
        ];
        if (Array.isArray(dependencies[key])) {
          dependencies[key]
            .map((plugin) => `${plugin.name} version:${plugin.version}`)
            .forEach((line) => result.push(line));
        } else {
          result.push(dependencies[key]);
        }
        return result;
      })
      .flat()
  );
  const length = !dependencies ? helpLines.length - 1 : helpLines.length;
  return helpLines.slice(0, length).map((line) => ` *${line ? ' ' : ''}${line}`);
}

/**
 *
 * @param {object} config コンフィグ
 * @param {string[]} structureTypes 構造体の型一覧
 * @param {string[]} knownTypes 既知の構造体一覧
 * @param {string} language 言語
 * @return {string}
 */
function generateStructuresText(config, structureTypes, knownTypes, language) {
  const probablyNewTypes = [];
  const result = Array.from(new Set(structureTypes))
    .map((structureType) => {
      return generateStructureText(config, structureType, language, probablyNewTypes);
    })
    .join('\n');
  /**
   * 未知の型が入れ子で登場した場合、再帰する
   */
  const newTypes = probablyNewTypes.filter((type) => !knownTypes.includes(type));
  if (newTypes.length > 0) {
    return `${result}\n${generateStructuresText(config, newTypes, knownTypes.concat(newTypes), language)}`;
  }
  return result;
}

/**
 * 構造体の型を表すヘルプテキストを生成する
 * 入れ子になった構造体の型名を渡された配列に格納する
 * @param {object} config コンフィグ
 * @param {string} type 型
 * @param {string} language 言語
 * @param {string[]} probablyNewTypes 未知の構造体かもしれない型を格納する配列
 * @return {string}
 */
function generateStructureText(config, type, language, probablyNewTypes) {
  const parameters = config.structures[type];
  if (!parameters) throw `unknown structure: ${type}`;
  return `/*~struct~${languageSuffixedType(type, language)}:
${parameters
  .map((parameter) => {
    const parameterObject = new PluginParameter(parameter);
    if (parameterObject.isStructure()) {
      const structureType = parameterObject.baseType();
      if (!config.structures[structureType]) throw `unknown structure: ${structureType}`;
      probablyNewTypes.push(structureType);
    }
    return parameterObject.toParameterText(language);
  })
  .join('\n *\n')}
 */`;
}

/**
 * 型名に言語サフィックスをつけて返す
 * @param {string} type 型名
 * @param {string} language 言語
 * @return {string}
 */
function languageSuffixedType(type, language) {
  if (language !== 'ja') {
    const suffix = `${language.substring(0, 1).toUpperCase()}${language.substring(1)}`;
    return `${type}${suffix}`;
  }
  return type;
}

module.exports = {
  generateHeader,
  PluginParameter,
};
