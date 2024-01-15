# Contribution Guide

Thank you for investing your time in contributing to this project.
In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

If you want to translate a plugin, please see also [How to translate plugin](HOW_TO_TRANSLATE.md).

# Pull Request Process

1. After creating PR, maintainer of this project (elleonard = DarkPlasma) will review your PR.
2. If it needs to be modified, maintainer comments on the PR.
3. If you have no reaction to the comments in 7 days, the PR is regarded as discarded, maintainer will close it.
4. If maintainer approve merging, maintainer will merge the PR immediately.

# Rules

## Coding Rule

You can use `yarn format`.

Naming conventions follow that used in RMMZ-core.
Please don't use name that has no meaning. Like `temp` `foo` `bar` .

Class name must be UpperCamelCase.
Variable or method name must be lowerCamelCase.

Private symbol name must have `_` prefix.

## Versioning Rule (Semantic Versioning)

You MUST add changelog to `config.yml` or `config.ts` for all the plugins you changed.
Version number format is semntic versioning. ( `X.Y.Z` )

### Major version (X)

You should not increment major version, without discussion with maintainer.
The changes like following, you MUST discuss the PR with maintainer.

- Has any breaking changes at parameters of plugin or plugin command.
- Has any breaking changes at program interfaces specified in plugin help.
- Has any breaking changes at game save data.(Changes like that Player cannot load old save data after update plugin).

### Minor version (Y)

If you add a feature to an plugin with no breaking changes, you MUST increment minor version.

### Patch Version (Z)

If you fix bug or refactor plugin without adding a feature and breaking changes, you MUST increment patch version.
If you translate the plugin `config.yml` or `config.ts` to new language too.

### Changes with no version increment

You should increment proper version with changes, except change only comments, like fix typo in changelog or help.

## Review

### Clear descrption of changes

At first, maintainer read the PR's title, description, commit messages.
You should make clear the changes and background.

Good: Fix bug that stop the game by TypeError on shop scene started

Bad: Fix bug of shop

Commit message format is following.
x.y.z Fix bug that stop the game by TypeError on shop scene started
( `x.y.z` is version.)

And you must add `histries` in `config.yml` or `config.ts` .

### Single responsibility principle

Plugin must have single responsibility.
For example, you should not the feature that display character stand image to NameWindow plugin.
(NameWindow plugin must display name and must not have the different meaning feature).

As same as, class and method must have single responsibility.
For example, `Window` class must not call `Scene` class method directly.

## If no response from maintainer

Please contact me.

- [@elleonard_f](https://twitter.com/elleonard_f)
