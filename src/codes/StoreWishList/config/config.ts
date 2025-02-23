import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createColorParam, createCommand, createStringParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/02/23",
    version: "1.0.0",
    description: "公開",
  }
];

const commandSceneWishList = createCommand("sceneWishList", {
  text: "ウィッシュリストを開く",
});

const parameters: PluginParameterSchema[] = [
  createColorParam("wishListRegisteredColor", {
    text: "登録済み色",
    description: "ウィッシュリスト登録済みアイテムの色を指定します。",
    default: 24,
  }),
  createStringParam("emptyText", {
    text: "空の時のテキスト",
    description: "ウィッシュリストが空の時に表示するテキストを設定します。",
    default: "ウィッシュリストに何も登録されていません",
  }),
  createStringParam("resultLabel", {
    text: "成果物ラベル",
    description: "ウィッシュリストに表示する成果物のラベルを設定します。",
    default: "成果物",
  }),
  createStringParam("materialLabel", {
    text: "素材ラベル",
    description: "ウィッシュリストに表示する素材のラベルを設定します。",
    default: "素材",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "StoreWishList",
  2025,
  "ウィッシュリストの保存と表示"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withCommand(commandSceneWishList)
  .withParameters(parameters)
  .withHelp(dedent`ウィッシュリストを保存・表示します。
    
    アイテム合成などでの必要素材をウィッシュリストとして保存し、
    一覧を表示するプラグインです。
    ウィッシュリストに追加したアイテムは、
    入手した時点でウィッシュリストから外れます。
    
    ウィッシュリスト表示シーンを開く
    SceneManager.push(Scene_WishList);

    本プラグインはセーブデータを拡張します。
    ウィッシュリストの情報をセーブデータに追加します。

    ウィッシュリストへの登録・削除は拡張プラグインを利用してください。
    DarkPlasma_WishListForFusionItem.jsを利用すると
    DarkPlasma_FusionItem.jsで追加するアイテム融合ショップで
    ウィッシュリスト登録・削除が可能になります。

    拡張プラグインを作るためのインターフェースは
    配布元リポジトリmasterブランチにある
    TypeScriptの型定義を参照してください。
    `)
  .build();
