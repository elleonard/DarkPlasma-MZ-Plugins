import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/09",
    version: "1.1.0",
    description: "スキル対象を引き継ぐ設定に対応",
  },
  {
    date: "2023/11/25",
    version: "1.0.0",
    description: '公開',
  }
];

export const config = new ConfigDefinitionBuilder(
  "RandomSkill",
  2026,
  "指定したスキルのうちどれかひとつを発動する使用効果"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueEffectCode",
    version: "1.0.2",
    order: 'after',
  })
  .withHelp(dedent`使用するとランダムで指定したスキルのうち
      どれか一つを発動する使用効果を実現します。

      スキルまたはアイテムのメモ欄に以下のように記述すると
      2/3でスキルID5、1/3でスキルID6が発動します。

      <randomSkill:
        skillId:5, weight:2
        skillId:6, weight:1
      >

      対象は発動するスキルの対象範囲からランダムに決定します。
      この使用効果を持つスキルと同じ対象にしたい場合は、
      対象範囲を揃えた上で以下のように記述してください。
      
      <randomSkill:
        skillId:5, weight:2, target: same
        skillId:6, weight:1
      >
      target: sameを記述したスキルのみ、同じ対象に発動します。
      (対象範囲が異なる場合の挙動は定義しません)`)
  .build();
