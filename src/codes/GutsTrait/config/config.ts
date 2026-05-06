import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/05/06",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "GutsTrait",
  2026,
  "食いしばり特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.2",
  })
  .withBaseDependency({
    name: "DarkPlasma_StateWithValue",
    version: "1.0.0",
  })
  .withHelp(dedent`特徴「食いしばり」を提供します。
    
    食いしばり特徴を持つバトラーは、戦闘中にHPが0になる際に
    戦闘不能になる代わりにHPを1にし、食いしばり回数を1消費します。
    
    食いしばり回数は以下のタイミングで特徴に応じて獲得します。
    - 戦闘開始時(装備などですでに得ていた特徴)
    - ステート付加(ステートの特徴)

    ステートの持つ食いしばり回数は個別に管理されます。
    残り回数の少ないステートの持つ回数を優先して消費します。

    <guts:1>
    アクター、職業、装備、敵キャラ、ステートのメモ欄に記述すると、
    食いしばり回数1の食いしばり特徴を設定します。
    
    <removeByGutsZero>
    ステートのメモ欄に記述すると
    解除条件「食いしばり発動後、ステートの食いしばり回数が0になった時に解除」を設定します。`)
  .build();
