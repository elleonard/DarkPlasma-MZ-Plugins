import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2024/10/14",
    version: "1.0.0",
    description: "公開",
  }
];

export const config = new ConfigDefinitionBuilder(
  "AdditionalAttackedAnimationTrait",
  2024,
  "攻撃を受ける際に追加アニメーションを表示する特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitCode",
    version: "1.0.1",
    order: "after",
  })
  .withHelp(dedent`攻撃を受ける際に追加アニメーションを表示する特徴を設定します。
    
    アクター、職業、装備、敵キャラ、ステートのメモ欄に以下のように記述すると
    攻撃(ダメージを伴う行動)を受ける際にアニメーション1を追加で表示します。
    <additionalAttackedAnimation:1>`)
  .build();
