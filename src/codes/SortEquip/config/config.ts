import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createColorParam, createSelectParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/08/25",
    version: "1.0.1",
    description: "装備が増殖してしまう不具合を修正",
  },
  {
    description: "最上部以外の整列対象一覧が正しく生成できない不具合を修正",
  },
  {
    date: "2025/08/24",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

const parameters = [
  createColorParam("selectedSortColor", {
    text: "選択中色",
    description: "選択中の整列パラメータの表示色を設定します。",
    default: 2,
  }),
  createSelectParam("key", {
    text: "",
    description: "",
    options: [
      {
        name: "shift",
      },
      {
        name: "menu",
      },
      {
        name: "tab",
      },
      {
        name: "control",
      },
    ],
    default: "shift",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "SortEquip",
  2025,
  "装備を整列する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_ParameterText",
    version: "1.0.5",
  })
  .withBaseDependency({
    name: "DarkPlasma_CustomKeyHandler",
    version: "1.3.0",
    order: "after",
  })
  .withHelp(dedent`装備画面で装備を選択する際に、
    プレイヤーが特定の操作を行うことで装備を整列することができます。`)
  .build();
