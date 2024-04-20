import { I18nText, PluginCommandSchema, PluginConfigSchema, PluginDependenciesSchema, PluginDependencySchema, PluginHistorySchema, PluginLocateSchema, PluginParameterSchema, PluginStruct } from "./configSchema.js";

export class ConfigDefinitionBuilder {
  _name: string;
  _year: number;
  _license: string;
  _histories: PluginHistorySchema[];
  _locates: PluginLocateSchema[];
  _plugindesc: string | I18nText;
  _parameters: PluginParameterSchema[];
  _commands: PluginCommandSchema[];
  _structures: PluginStruct[];
  _dependencies: PluginDependenciesSchema;
  _help: string | I18nText;

  constructor(
    name: string,
    year: number,
    plugindesc: string | I18nText
  ) {
    this._name = name;
    this._year = year;
    this._license = "MIT";
    this._histories = [];
    this._locates = ['ja'];
    this._plugindesc = plugindesc;
    this._parameters = [];
    this._commands = [];
    this._structures = [];
    this._dependencies = {
      base: [],
      orderAfter: [],
      orderBefore: [],
    };
    this._help = "";
  }

  pluginName() {
    return `DarkPlasma_${this._name}`;
  }

  withLicense(license: string) {
    this._license = license;
    return this;
  }

  withHistory(history: PluginHistorySchema) {
    this._histories.push(history);
    return this;
  }

  withHistories(histories: PluginHistorySchema[]) {
    this._histories.push(...histories);
    return this;
  }

  withLocate(locate: PluginLocateSchema) {
    this._locates.push(locate);
    return this;
  }

  withParameter(parameter: PluginParameterSchema) {
    this._parameters.push(parameter);
    return this;
  }

  withParameters(parameters: PluginParameterSchema[]) {
    this._parameters.push(...parameters);
    return this;
  }

  withCommand(command: PluginCommandSchema) {
    this._commands.push(command);
    return this;
  }

  withCommands(commands: PluginCommandSchema[]) {
    this._commands.push(...commands);
    return this;
  }

  withStructure(structure: PluginStruct) {
    this._structures.push(structure);
    return this;
  }

  withDependency(dependency: PluginDependencySchema) {
    if (dependency.base) {
      this.withBaseDependency(dependency);
    }
    if (dependency.order === "after") {
      this.withOrderAfterDependency(dependency);
    } else if (dependency.order === "before") {
      this.withOrderBeforeDependency(dependency);
    }
    return this;
  }

  withBaseDependency(dependency: PluginDependencySchema) {
    this._dependencies.base.push(dependency);
    return this;
  }

  withOrderAfterDependency(dependency: PluginDependencySchema) {
    this._dependencies.orderAfter.push(dependency);
    return this;
  }
  
  withOrderBeforeDependency(dependency: PluginDependencySchema) {
    this._dependencies.orderBefore.push(dependency);
    return this;
  }

  withHelp(help: string | I18nText) {
    this._help = help;
    return this;
  }

  build(): PluginConfigSchema {
    return {
      name: this.pluginName(),
      year: this._year,
      license: this._license,
      histories: this._histories,
      locates: this._locates,
      plugindesc: this._plugindesc,
      parameters: this._parameters,
      commands: this._commands,
      structures: this._structures,
      dependencies: this._dependencies,
      help: this._help,
    };
  }
}
