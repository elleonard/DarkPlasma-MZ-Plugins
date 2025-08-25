import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/08/25",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "SkillWeaponTypeTrait",
  2025,
  "スキル必要武器タイプを満たす特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.2",
  })
  .withBaseDependency({
    name: "DarkPlasma_LazyExtractData",
    version: "1.0.0",
    order: "after",
  })
  .withHelp(dedent`アクター等、特徴を設定できるデータのメモ欄に以下のように記述します。
    <skillWeaponType:剣>
    スキルの必要武器を判定する際に
    武器タイプ剣を装備していると扱われる特徴を設定します。

    <skillWeaponType:剣,槍>
    複数指定したい場合はカンマで区切ります。`)
  .build();
