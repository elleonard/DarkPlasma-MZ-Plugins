import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/09/13",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "DualWieldDamageRateTrait",
  2025,
  "二刀流連撃行動のダメージ倍率特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_DualWieldRepeats",
    version: "1.0.0",
  })
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.2",
  })
  .withHelp(dedent`二刀流連撃ダメージ倍率を変更する特徴を設定します。
    バトラーの二刀流連撃ダメージ倍率はデフォルトで100％です。

    二刀流連撃ダメージ倍率:
    DarkPlasma_DualWieldRepeatsで設定した二刀流連撃行動について
    バトラーが二刀流特徴を持つ場合にダメージに乗算されます。
    
    <dualWieldRepeatsDamageRate:n>
    二刀流連撃ダメージ倍率をn％乗算します。
    
    <dualWieldRepeatsDamageRatePlus:n>
    二刀流連撃ダメージ倍率をn％加算します。`)
  .build();
