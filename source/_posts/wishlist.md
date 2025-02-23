---
title: ウィッシュリストの保存と表示
category:
  - プラグイン解説
date: 2025-02-20 13:22:30
tags:
  - アイテム
  - 合成
description: ウィッシュリストを保存・表示します。
thumbnail: register.png
---

# 概要

アイテムをウィッシュリストに保存・表示します。

# 使用例

![使用例](register.png "使用例")

[アイテム融合ショップ](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_FusionItem.js)での使用例です。
特定のキーを押すことで、選択中のアイテムをウィッシュリストに登録したり、削除したりします。

![使用例](list.png "使用例")

登録したアイテムと素材一覧を確認することができます。

![使用例](notify.png "使用例")

[TorigoyaMZ_NotifyMessage.js](https://torigoya-plugin.rutan.dev/map/notifyMessage/)と組み合わせて、素材が揃った時に通知を出すことができます。

# プラグインの構成

[DarkPlasma_StoreWishList.js](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_StoreWishList.js)

ウィッシュリストを保存・表示する仕組みのみ提供する基底プラグインです。
ウィッシュリスト登録については、各アイテム合成系プラグインに対応した拡張プラグインが必要となります。

[DarkPlasma_WishListForFusionItem.js](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_WishListForFusionItem.js)
[DarkPlasma_FusionItem.js](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_FusionItem.js)に対応した拡張プラグインです。
アイテム融合ショップでウィッシュリスト登録・削除が可能になります。

[DarkPlasma_NotifyWishList.js](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_NotifyWishList.js)
[TorigoyaMZ_NotifyMessage.js](https://torigoya-plugin.rutan.dev/map/notifyMessage/)が必要です。
ウィッシュリストに登録されたアイテムの素材が揃った時に通知を表示します。

# ダウンロードページへのリンク

[DarkPlasma_StoreWishList.js](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_StoreWishList.js)
[DarkPlasma_WishListForFusionItem.js](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_WishListForFusionItem.js) ([DarkPlasma_FusionItem.js](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_FusionItem.js)が必要です)
[DarkPlasma_NotifyWishList.js](https://github.com/elleonard/DarkPlasma-MZ-Plugins/blob/release/DarkPlasma_NotifyWishList.js) ([TorigoyaMZ_NotifyMessage.js](https://torigoya-plugin.rutan.dev/map/notifyMessage/)が必要です)

ダウンロード方法については {% post_link about %} を参照してください。
