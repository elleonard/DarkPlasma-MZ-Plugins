import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createMultilineStringParam, createSelectParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/02/23",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters = [
  createSelectParam("registerKey", {
    text: "登録/削除キー",
    description: "融合ショップでこのキーを押すと、対象アイテムをウィッシュリスト登録/削除します。",
    options: [
      {
        name: "shift",
      },
      {
        name: "control",
      },
      {
        name: "tab",
      },
    ],
    default: "shift",
  }),
  createMultilineStringParam("registerMessage", {
    text: "登録時メッセージ",
    description: "ウィッシュリスト登録時にメッセージを表示します。",
    default: "{item}をウィッシュリストに登録しました。",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "WishListForFusionItem",
  2025,
  "アイテム融合ショップ用ウィッシュリスト登録"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withBaseDependency({
    name: "DarkPlasma_StoreWishList",
    version: "1.0.0",
  })
  .withBaseDependency({
    name: "DarkPlasma_FusionItem",
    version: "2.1.1",
    order: 'after',
  })
  .withBaseDependency({
    name: "DarkPlasma_CustomKeyHandler",
    version: "1.3.0",
    order: 'after',
  })
  .withParameters(parameters)
  .withHelp(dedent`アイテム融合ショップでウィッシュリスト登録できます。
    アイテム融合ショップでそのアイテムを入手すると、
    ウィッシュリストから削除します。
    
    ウィッシュリスト登録時のメッセージ表示について
    DarkPlasma_Scene_MessageMixIn など、
    融合ショップにメッセージウィンドウを追加するプラグインがあると
    ショップで登録した際にその場でメッセージ表示できます。`)
  .build();
