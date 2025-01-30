import { ConfigDefinitionBuilder } from '../../../../modules/config/configDefinitionBuilder.js';
import { PluginHistorySchema, PluginParameterSchema } from '../../../../modules/config/configSchema.js';
import { createSelectArrayParam, createSelectParam } from '../../../../modules/config/createParameter.js';
import { dedent } from '@qnighy/dedent';

const histories: PluginHistorySchema[] = [
  {
    date: "2025/01/30",
    version: "1.0.0",
    description: "公開",
  }
];

const parameters: PluginParameterSchema[] = [
  createSelectArrayParam("itemSortKeys", {
    text: "アイテムの並び順キー",
    options: [
      {
        name: "ID",
        value: "id",
      },
      {
        name: "価格",
        value: "price",
      },
    ],
    default: ["id"],
  }),
  createSelectArrayParam("weaponSortKeys", {
    text: "武器の並び順キー",
    options: [
      {
        name: "ID",
        value: "id",
      },
      {
        name: "攻撃力",
        value: "atk",
      },
      {
        name: "防御力",
        value: "def",
      },
      {
        name: "魔法力",
        value: "mat",
      },
      {
        name: "魔法防御",
        value: "mdf",
      },
      {
        name: "敏捷性",
        value: "agi",
      },
      {
        name: "運",
        value: "luk",
      },
      {
        name: "最大HP",
        value: "mhp",
      },
      {
        name: "最大MP",
        value: "mmp",
      },
      {
        name: "価格",
        value: "price",
      },
      {
        name: "武器タイプ",
        value: "wtypeId",
      },
    ],
    default: ["id"],
  }),
  createSelectArrayParam("armorSortKeys", {
    text: "防具の並び順キー",
    options: [
      {
        name: "ID",
        value: "id",
      },
      {
        name: "攻撃力",
        value: "atk",
      },
      {
        name: "防御力",
        value: "def",
      },
      {
        name: "魔法力",
        value: "mat",
      },
      {
        name: "魔法防御",
        value: "mdf",
      },
      {
        name: "敏捷性",
        value: "agi",
      },
      {
        name: "運",
        value: "luk",
      },
      {
        name: "最大HP",
        value: "mhp",
      },
      {
        name: "最大MP",
        value: "mmp",
      },
      {
        name: "価格",
        value: "price",
      },
      {
        name: "装備タイプ",
        value: "etypeId",
      },
      {
        name: "防具タイプ",
        value: "atypeId",
      },
    ],
    default: ["id"],
  }),
  createSelectParam("goodsOrder", {
    text: "商品の並び順",
    description: "並び順キーに従って昇順・降順どちらで並べるかを指定します。",
    options: [
      {
        name: "昇順",
        value: "asc",
      },
      {
        name: "降順",
        value: "desc",
      },
    ],
    default: "asc",
  }),
];

export const config = new ConfigDefinitionBuilder(
  "OrderShopGoods",
  2025,
  "ショップの商品の並び順を指定する"
)
  .withHistories(histories)
  .withLicense("MIT")
  .withParameters(parameters)
  .withOrderAfterDependency({
    name: "DarkPlasma_OrderIdAlias",
  })
  .withOrderAfterDependency({
    name: "DarkPlasma_FusionShop",
  })
  .withHelp(dedent`ショップの商品の並び順を指定します。
    
    商品はアイテム・武器・防具のカテゴリ順に並び、
    その後それぞれのカテゴリ内で、本プラグインの設定に従って並びます。
    DarkPlasma_OrderIdAliasとともに使用して並び順キーにIDを指定した場合、
    データベースのIDの代わりにOrderIdが使用されます。`)
  .build();
