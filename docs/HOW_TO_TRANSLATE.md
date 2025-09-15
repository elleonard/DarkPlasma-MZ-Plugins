# How to translate plugin

## prerequisite

- You can use Git, GitHub, RMMZ.
- Fork this repository.

## Translate workflow

1. Make branch for translation.
2. Add translation to `config.ts` or `config.yml` .
3. Build the plugin and see the translated plugin on RMMZ.
4. Push the commit and Create PR.
5. Maintainer (elleonard) review the PR, and approve or reject.
6. If approved, the PR merged.

### Make branch for translation.

```bash
git switch master
git pull upstream master
git switch -c <branch>
```

Any `<branch>` name is Ok.
For example `translate-order-id-alias_en` .

Note that, when translate plugin, you MUST commit one plugin in one PR.

### Add translation to config.

Please see [Translation Example](https://github.com/elleonard/DarkPlasma-MZ-Plugins/pull/53).

For `config.ts`, please see [config.ts Example](https://github.com/elleonard/DarkPlasma-MZ-Plugins/pull/62).

### Build the plugin and see the translated plugin on RMMZ.

To build plugin, it needs to install NodeJS (v20), Yarn (v4.7.0 or later).

```bash
yarn install
yarn build --target <plugin>
```

`<plugin>` is plugin name. (The directory name is `./src/codes/<plugin>` ).

Then, You can see `./_dist/codes/DarkPlasma_<plugin>.js` .
After copying the file to RMMZ test project's `./js/plugins/` directory, RMMZ(that you set language which plugin translated) you can see the translated plugin!

### Push the commit and Create PR.

```bash
git add ./src/codes/<plugin>/
git commit -m "x.y.z <language ja>翻訳を追加 (Add <language en> translation)"
git push origin <branch>
```

`<language ja>` is language name in Japanese, like `英語` , `韓国語` .
`<language en>` is language name in English, like `English` , `Korean` .

Then, Create Pull Request to elleonard/DarkPlasma-MZ-Plugins master on GitHub.
