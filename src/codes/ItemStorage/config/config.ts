import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema } from '../../../../modules/config/configSchema.js';
import { createBooleanParam, createCommand, createNumberParam, createStringParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2026/11/24",
    version: "1.8.0",
    description: "configをTypeScript化",
  },
  {
    description: "倉庫に預けられる判定で預ける個数を指定可能にする",
  },
  {
    date: "2024/04/13",
    version: "1.7.0",
    description: "可能な限り預ける, 可能な限り引き出すプラグインコマンドの追加",
  },
  {
    date: "2023/12/17",
    version: "1.6.1",
    description: "倉庫に預けられる判定を整理",
  },
  {
    date: "2023/10/25",
    version: "1.6.0",
    description: "倉庫に預けるまたは引き出す数ウィンドウのインターフェースを公開",
  },
  {
    date: "2023/07/25",
    version: "1.5.0",
    description: "Window_StorageItemsのインターフェースを公開",
  },
  {
    description: "倉庫に預ける際の処理順変更",
  },
  {
    date: "2023/06/24",
    version: "1.4.0",
    description: "所持している数、倉庫に入っている数のテキスト設定を追加",
  },
  {
    date: "2023/04/02",
    version: "1.3.1",
    description: "typescript移行",
  },
  {
    date: "2022/05/22",
    version: "1.3.0",
    description: "DarkPlasma_OrderEquipに対応",
  },
  {
    date: "2022/05/14",
    version: "1.2.0",
    description: "アイテム出し入れ時に説明文が更新されない不具合を修正",
  },
  {
    description: "DarkPlasma_OrderIdAliasに対応",
  },
  {
    date: "2022/01/22",
    version: "1.1.0",
    description: "Scene_ItemStorageのインターフェースを公開",
  },
  {
    date: "2022/01/11",
    version: "1.0.1",
    description: "倉庫内にアイテムがあるかどうか判定できない不具合を修正",
  },
  {
    description: "最大数所持しているアイテムをそれ以上引き出せないように修正",
  },
  {
    description: "最大数預けているアイテムをそれ以上預けられないように修正",
  },
  {
    date: "2022/01/10",
    version: "1.0.0",
    description: "公開",
  },
];

const parameters = [
  createNumberParam("maxItems", {
    text: "アイテム別最大数",
    description: "倉庫内に格納できるアイテム1種類の最大数を設定します。",
    default: 99,
  }),
  createStringParam("partyItemCountText", {
    text: "所持している数テキスト",
    default: "所持している数",
  }),
  createStringParam("storageItemCountText", {
    text: "倉庫に入っている数テキスト",
    default: "倉庫に入っている数",
  }),
];

const commandOpenStorage = createCommand("openStorage", {
  text: "倉庫を開く",
  args: [
    createBooleanParam("item", {
      text: "アイテム表示",
      description: "カテゴリにアイテムを表示するか",
      default: true,
    }),
    createBooleanParam("weapon", {
      text: "武器表示",
      description: "カテゴリに武器を表示するか",
      default: true,
    }),
    createBooleanParam("armor", {
      text: "防具表示",
      description: "カテゴリに防具を表示するか",
      default: true,
    }),
    createBooleanParam("keyItem", {
      text: "大事なもの表示",
      description: "カテゴリに大事なものを表示するか",
      default: false,
    }),
  ],
});

const commandStoreAll = createCommand("storeAll", {
  text: "可能な限り預ける",
  description: "所持しているアイテムを可能な限り倉庫に預けます。",
  args: [
    createBooleanParam("item", {
      text: "アイテムを預ける",
      default: false,
    }),
    createBooleanParam("weapon", {
      text: "武器を預ける",
      default: false,
    }),
    createBooleanParam("armor", {
      text: "防具を預ける",
      default: false,
    }),
    createBooleanParam("keyItem", {
      text: "大事なものを預ける",
      default: false,
    }),
  ],
});

const commandFetchAll = createCommand("fetchAll", {
  text: "可能な限り引き出す",
  description: "倉庫に入っているアイテムを可能な限り引き出します。",
  args: [
    createBooleanParam("item", {
      text: "アイテムを引き出す",
      default: false,
    }),
    createBooleanParam("weapon", {
      text: "武器を引き出す",
      default: false,
    }),
    createBooleanParam("armor", {
      text: "防具を引き出す",
      default: false,
    }),
    createBooleanParam("keyItem", {
      text: "大事なものを引き出す",
      default: false,
    }),
  ],
});

export const config = new ConfigDefinitionBuilder(
  "ItemStorage",
  2022,
  "アイテム倉庫"
)
  .withHistories(histories)
  .withParameters(parameters)
  .withCommands([
    commandOpenStorage,
    commandStoreAll,
    commandFetchAll,
  ])
  .withHelp(dedent`アイテム倉庫シーンを提供します。
  プラグインコマンドで倉庫を開くことができます。`)
  .build();
