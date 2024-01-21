import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createDatabaseParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories = [
  {
    date: "2024/01/21",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters: PluginParameterSchema[] = [
  createDatabaseParam(
    "itemDiscardCommonEvent",
    {
      type: "common_event",
      text: "アイテムコモンイベント",
      description: "アイテムを捨てたときに実行するコモンイベントを設定します。",
    }
  ),
  createDatabaseParam(
    "weaponDiscardCommonEvent",
    {
      type: "common_event",
      text: "武器コモンイベント",
      description: "武器を捨てたときに実行するコモンイベントを設定します。",
    }
  ),
  createDatabaseParam(
    "armorDiscardCommonEvent",
    {
      type: "common_event",
      text: "防具コモンイベント",
      description: "防具を捨てたときに実行するコモンイベントを設定します。"
    }
  ),
  createDatabaseParam(
    "discardItemVariable",
    {
      type: "variable",
      text: "捨てたアイテム変数",
      description: "捨てたアイテムのIDを指定した変数に保存します。",
    }
  ),
];

export const config = new ConfigDefinitionBuilder(
  "CommonEventByDiscardItem",
  2024,
  "アイテムを捨てたときにコモンイベントを実行する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_DiscardItemCommand",
    version: "1.0.0",
  })
  .withHelp(dedent`DarkPlasma_DiscardItemCommandの捨てるコマンドによってアイテムを捨てた際に
  コモンイベントを実行します。`)
  .build();
