import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/01/05",
    version: "1.1.1",
    description: "依存プラグインのバージョン更新",
  },
  {
    date: "2025/01/05",
    version: "1.1.0",
    description: "異なる属性のダメージ倍率を加算するか乗算するかの設定を追加",
  },
  {
    date: "2025/01/05",
    version: "1.0.1",
    description: "単一属性の行動の属性を正常に反映できない不具合を修正",
  },
  {
    date: "2025/01/05",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters: PluginParameterSchema[] = [
  createBooleanParam("addition", {
    text: "加算するか",
    description: "ONにすると、異なる属性のダメージ倍率同士を加算します。OFFの場合は乗算します。",
    default: true,
  }),
];

export const config = new ConfigDefinitionBuilder(
  "ElementDamageBonusTrait",
  2025,
  "属性ダメージボーナス特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.2",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_MultiElementAction",
    version: "1.1.1",
  })
  .withHelp(dedent`アクター、職業、装備、敵キャラ、ステートのメモ欄に
    elementDamageBonusメモタグを設定することで
    指定した属性のダメージ倍率を増減する特徴を設定できます。

    設定例:
    火属性の与える属性ダメージ倍率+50％
    <elementDamageBonus:
      火:50
    >
    
    氷属性の与える属性ダメージ倍率+20％
    雷属性の与える属性ダメージ倍率+30％
    <elementDamangeBonus:
      氷:20
      雷:30
    >
    
    その属性の特徴の値をすべて加算した値を元に、与える属性ダメージ倍率を決定します。
    与える属性ダメージ倍率を敵の有効度に乗算して実際の属性ダメージを計算します。
    与える属性ダメージ倍率のデフォルト値は100％です。

    DarkPlasma_MultiElementActionで実現される複合属性については
    すべての属性について与える属性ダメージ倍率を計算し、それぞれを
    プラグインの設定に従って加算または乗算します。
    `)
  .build();
