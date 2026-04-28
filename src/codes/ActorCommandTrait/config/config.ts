import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import {} from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/04/28",
    version: "1.1.0",
    description: "アクターごとに異なる特徴にする機能を追加",
  },
  {
    version: "1.0.1",
    description: "設定をtypescript移行",
  },
  {
    date: "2023/09/17",
    version: "1.0.0",
    description: "最初のバージョン",
  }
];

export const config = new ConfigDefinitionBuilder(
  "ActorCommandTrait",
  2026,
  "アクターコマンドを変更する特徴"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_AllocateUniqueTraitId",
    version: "1.0.1",
    order: 'after',
  })
  .withHelp(dedent`アクターコマンドを変更する特徴を提供します。

      この特徴を追加したいデータ(ステートやアクターなど)のメモ欄に
      以下のように記述してください。
      <actorCommand:
        priority:優先度
        actorId:アクターID
        コマンド定義
        コマンド定義
        ...
      >

      この特徴を複数追加したい場合は以下のように記述してください。
      <actorCommand:
        {
          priority:優先度
          actorId:アクターID
          コマンド定義
          コマンド定義
          ...
        },
        {
          priority:優先度
          actorId:アクターID
          コマンド定義
          コマンド定義
          ...
        }
      >

      優先度
      この特徴が複数設定されている場合、
      優先度の最も大きいものが使用されます。
      優先度を省略すると、優先度0として扱われます。

      アクターID
      指定したアクターIDのみに有効な特徴になります。

      コマンド定義の書き方
      attack
        通常攻撃コマンド(戦う)
      
      skill
        スキル(スキルタイプの選択)

      skill/スキルID
        個別スキル
      
      guard
        防御コマンド
      
      item
        アイテムコマンド

      記述例1: (攻撃を除いたコマンドにする)
      <actorCommand:
        skill
        guard
        item
      >

      記述例2: (特定のスキルのみのコマンドにする。優先度1)
      <actorCommand:
        priority:1
        skill/35
        skill/36
      >
        
      記述例3: (アクターごとに異なるコマンドにする)
      <actorCommand:
        {
          actorId:1
          skill/8
          skill/9
          item
        },
        {
          actorId:2
          skill/6
          skill/8
          skill/9
          item
        }
      >`)
  .build();
