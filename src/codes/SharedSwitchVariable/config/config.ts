import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema, PluginStruct } from '../../../../modules/config/configSchema.js';
import { createCommand, createDatabaseParam, createStruct, createStructArrayParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/03/15",
    version: "2.0.0",
    description: "共有セーブデータの基礎実装をSharedSaveInfoに移行",
  },
  {
    description: "共有セーブに保存するプラグインコマンドを非推奨化",
  },
  {
    date: '2024/03/16',
    version: '1.0.4',
    description: 'イベントテストが起動できない不具合を修正',
  },
  {
    date: '2024/03/12',
    version: '1.0.3',
    description: 'TypeScript移行',
  },
  {
    description: 'TemplateEvent.jsがあるとゲームが起動しない不具合を修正',
  },
  {
    date: '2021/07/05',
    version: '1.0.2',
    description: 'MZ 1.3.2に対応',
  },
  {
    date: '2021/06/22',
    version: '1.0.1',
    description: 'サブフォルダからの読み込みに対応',
  },
  {
    date: '2021/05/29',
    version: '1.0.0',
    description: '公開',
  },
];

const commandSaveSharedInfo = createCommand("saveSharedInfo", {
  text: "(非推奨)共有セーブに保存する",
  description: "本コマンドは次バージョンで廃止します。詳細はヘルプを参照してください。",
});

const structSwitchRange: PluginStruct = createStruct("SwitchRange", [
  createDatabaseParam("from", {
    type: 'switch',
    text: "閉区間開始",
    description: "このスイッチ以降、終端で指定したスイッチまでを共有セーブに保存します。",
    default: 1,
  }),
  createDatabaseParam("to", {
    type: 'switch',
    text: "閉区間終端",
    description: "開始で指定したスイッチからこのスイッチまでを共有セーブに保存します。",
    default: 1,
  }),
]);

const structVariableRange: PluginStruct = createStruct("VariableRange", [
  createDatabaseParam("from", {
    type: 'variable',
    text: "閉区間開始",
    description: "この変数以降、終端で指定した変数までを共有セーブに保存します。",
    default: 1,
  }),
  createDatabaseParam("to", {
    type: 'variable',
    text: "閉区間終端",
    description: "開始で指定した変数からこの変数までを共有セーブに保存します。",
    default: 1,
  }),
]);

const parameters: PluginParameterSchema[] = [
  createStructArrayParam("switchRangeList", {
    struct: structSwitchRange,
    text: "スイッチ範囲リスト",
    description: "共有セーブに保存するスイッチの範囲リストを指定します。",
  }),
  createStructArrayParam("variableRangeList", {
    struct: structVariableRange,
    text: "変数範囲リスト",
    description: "共有セーブに保存する変数の範囲リストを指定します。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "SharedSwitchVariable",
  2026,
  "全てのセーブデータで共有するスイッチ・変数を指定する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withStructure(structSwitchRange)
  .withStructure(structVariableRange)
  .withParameters(parameters)
  .withCommands([commandSaveSharedInfo])
  .withBaseDependency({
    name: "DarkPlasma_SharedSaveInfo",
    version: "1.0.0",
    order: 'after',
  })
  .withHelp(dedent`全てのセーブデータで共有するスイッチ・変数を指定します。
      指定したスイッチ・変数の値は共有セーブデータ(save/shared.rmmzsave)に保存します。

      プラグインコマンドで共有セーブデータを更新できます。
      
      共有セーブに保存するプラグインコマンドは次のバージョンアップで廃止するため、非推奨です。
      DarkPlasma_SharedSaveInfoのプラグインコマンドをご利用ください。`)
  .build();
