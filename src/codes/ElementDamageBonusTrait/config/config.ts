import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
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

export const config = new ConfigDefinitionBuilder(
  "ElementDamageBonusTrait",
  2025,
  "属性ダメージボーナス特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.2",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_MultiElementAction",
    version: "1.1.0",
  })
  .withHelp(dedent`アクター、職業、装備、敵キャラ、ステートのメモ欄に
    elementDamageBonusメモタグを設定することで
    指定した属性のダメージ倍率を増減する特徴を設定できます。

    設定例:
    火属性を含む行動のダメージ倍率+50％
    <elementDamageBonus:
      火:50
    >
    
    氷属性を含む行動のダメージ倍率+20％
    雷属性を含む行動のダメージ倍率+30％
    <elementDamangeBonus:
      氷:20
      雷:30
    >
    `)
  .build();
