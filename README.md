# このリポジトリは何？

DarkPlasmaによるRPGツクールMZのプラグイン開発を行うリポジトリです。

# プラグインをダウンロードしたい

TODO: 

# ビルドしたい

node と yarn が必要です。

```bash
yarn install
yarn build
```
`yarn install` は初回のみ必要です。

# 動作確認したい

./scripts/copyToProject/config.yml に、プロジェクトのディレクトリパスを追記した上で、下記コマンドで watch モードにすると、編集後にビルド結果を自動的にプロジェクトにコピーしてくれます。

```bash
yarn install
yarn watch
```
`yarn install` は初回のみ必要です。

# コミットしたい

[CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。

# ディレクトリ構造

## _dist

ビルド後の成果物を出力します。

## extensions/rollup

rollup.js の拡張を配置します。  
RPGツクールMZ向けプラグインだけ書きたいのであれば、意識しなくても構いません。

## node_modules

yarn のモジュールが自動的に配置されます。  
RPGツクールMZ向けプラグインだけ書きたいのであれば、意識しなくても構いません。

## scripts

ビルド用スクリプトを配置します。  
RPGツクールMZ向けプラグインだけ書きたいのであれば、ほぼ意識しなくても構いません。

./scripts/copyToProject/config.yml のみ、ビルド結果をプロジェクトディレクトリにコピーして確認するためのディレクトリパス設定を書く必要があります。
同ディレクトリにいる comfig_sample.yml を参考に書いてください。

## src

ビルド前の編集すべきファイルを配置します。

### src/codes

`yarn generate (プラグイン名)` コマンドにより、プラグイン名のディレクトリを作り、その下に `DarkPlasma_(プラグイン名).js` という名前でプラグインのソースコード本体を、 `config.yml` を配置します。

プラグインを書いたり修正したりする場合、必ずこのソースコード本体と `config.yml` を編集してください。

### src/common

共通処理が入っています。基本的に意識しなくて構いません。

### src/excludes

リポジトリにコミットしたくないプラグインを書く場合、以下のコマンドを使うと codes ディレクトリの代わりにこちらへプラグインのベースを生成します。

```bash
yarn generate (プラグイン名) e
```

### src/templates

ビルド用テンプレートが入っています。基本的に意識しなくて構いません。

### src/typings

RPGツクールMZ向けの型定義ファイルを配置します。  
まだMVの内容も混じっているので、適宜更新していきます。
