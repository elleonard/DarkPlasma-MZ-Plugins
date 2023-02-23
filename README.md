# このリポジトリは何？ What is this repository?

DarkPlasma による RPG ツクール MZ のプラグイン開発を行うリポジトリです。

This repository is for development RMMZ plugin `DarkPlasma` series.

# プラグインをダウンロードしたい How to Download plugin?

[release ブランチ](https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release)をご覧ください。

メジャーバージョンが上がっているものにご注意ください。  
以前のバージョンに上書きすると、プラグインパラメータの設定値が初期化されます。  
お手数ですが、必ず、上書き前に以前の設定を記録しておくようにしてください。

Please see [branch for release](https://github.com/elleonard/DarkPlasma-MZ-Plugins/tree/release).

# ビルドしたい How to build plugin?

NodeJS (v16以降) と Yarn (v1.22.18以降) が必要です。

To build plugin, it needs to install NodeJS (v16 or later), Yarn (v1.22.18 or later).

```bash
yarn install
yarn build --target <plugin>
```

`yarn install` は初回のみ必要です。

You must `yarn install` only first build.

ビルド完了後、 `_dist/codes` フォルダ下に `DarkPlasma_<plugin>.js` が生成されます。

Then, `DarkPlasma_<plugin>.js` is built and you can see it in `./_dist/codes/` directory.

### ビルド用オプション Build options

|option|required?|description|
|:----------|:--|:---|
|--target &lt;BuildTarget&gt;|yes|ビルド対象を指定します。|
|--js|no|ビルド対象がjavascriptである場合に指定します。|
|--exclude|no|excludesディレクトリ以下の対象をビルドします。|
|--configOnly|no|config.ymlのみビルドします。|
|--noFinalize|no|ビルド後の成果物のフォーマットとコピーを行いません。|

# 動作確認したい How to check plugin?

ビルドしたプラグインをRPGツクールMZのプロジェクトの `js/plugins` フォルダに入れて確認してください。

Please check built plugin by copying it into RMMZ test project's `./js/plugins/` directory.

./scripts/copyToProject/config.yml に、プロジェクトのディレクトリパスを追記した上でビルドすると、自動的にプロジェクトにコピーしてくれます。

If you set `./scripts/copyToProject/config.yml` and building plugin, it automatically copy the plugin to the project.

# コミットしたい How to commit? (Including how to translate plugin)

[CONTRIBUTING.md](./docs/CONTRIBUTING.md) を参照してください。

Plase see [CONTRIBUTING.en.md](./docs/CONTRIBUTING.en.md).

# ディレクトリ構造

## \_dist

ビルド後の成果物を出力します。

## extensions/rollup

rollup.js の拡張を配置します。  
RPG ツクール MZ 向けプラグインだけ書きたいのであれば、意識しなくても構いません。

## node_modules

yarn のモジュールが自動的に配置されます。  
RPG ツクール MZ 向けプラグインだけ書きたいのであれば、意識しなくても構いません。

## scripts

ビルド用スクリプトを配置します。  
RPG ツクール MZ 向けプラグインだけ書きたいのであれば、ほぼ意識しなくても構いません。

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

RPG ツクール MZ 向けの型定義ファイルを配置します。  
まだ MV の内容も混じっているので、適宜更新していきます。
