import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createDatabaseParam, createMapParam, createStruct, createStructArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/07/19",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const structSwitchMapTileset: PluginStruct = createStruct("SwitchMapTileset", [
  createDatabaseParam("switchId", {
    type: 'switch',
    text: "スイッチ",
  }),
  createMapParam("mapId", {
    text: "マップ",
  }),
  createDatabaseParam("tilesetId", {
    type: 'tileset',
    text: "タイルセット",
  }),
]);

const parameters: PluginParameterSchema[] = [
  createStructArrayParam("switchMapTileset", {
    struct: structSwitchMapTileset,
    text: "スイッチ連動タイルセット",
    description: "スイッチに連動して変化するタイルセットの設定一覧",
  })
];

export const config = new ConfigDefinitionBuilder(
  "ConditionalTileset",
  2026,
  "条件連動タイルセット"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structSwitchMapTileset)
  .withParameters(parameters)
  .withHelp(dedent`指定した条件に連動して、指定マップのタイルセットを変更します。`)
  .build();
