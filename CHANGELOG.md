# Changelog

## 1.1.3 (2018-10-28)
### Added
- `deepAssign` function added to `helpers`.
- Tests improved and `function` tests added for `helpers.deepAssign`, `helpers.matchExpression`, and `helpers.parsePatterns`.

## 1.1.2 (2018-10-24)
### Fixed
- `createDirectory` function now works with absolute paths.
- `patterns` now parsed as file paths.

## 1.1.1 (2018-10-23)
### Changed
- Dependencies updated to latest versions.
- Restructured project files with helpers in separate directory and tests placed in separate directory `test` directory as well as updated to reflect new changes.
- Expression matching helper optimized using `planckmatch`'s new `match.all` and `match.any` functions.
- Renamed `helper` property to `helpers` as well as certain names of helper functions, see the list below. (Legacy support is still present.)
  - `match` to `matchExpressions`
  - `parse` to `parsePatterns`
  - `remove` to `removeFiles`
- Exposed underlying `single` functions of helpers which iterate over an array. The are of the `removeFiles` and `writeFiles` helpers with the `single` functions exposed as `removeFiles.single` and `writeFiles.single` respectively.
### Fixed
- `directory` parameter now properly used when removing and writing files to storage.

## 1.1.0 (2018-10-17)
### Added
- `parse` and `match` functions added to helper functions.
- Filter functionality added when scanning for files added, configurable via `pattern` and `patternOptions` options.
### Changed
- Slight optimization of array flattening in the `library/scanDirectory` function.
### Fixed
- Fixed `options.remove` when using a string or array of strings to specify files.

## 1.0.2 (2018-10-10)
### Added
- `hoast` icon added to `README.md`.
### Changed
- Rewrote sections of `README.md`.
- Updated keywords in `package.json`.

## 1.0.1 (2018-09-28)
### Changed
- Updated documentation found in `README.md`.

## 1.0.0 (2018-09-26)
### Added
- CodeCov coverage report added to CI workflow.
### Changed
- Restructured project files.
- Update examples to match with new versions of any modules.

## 0.2.0 (2018-09-11)
### Added
- `CHANGELOG.md` added.
- `scanDirectory` function added to helper functions.
- `remove` function added to helper functions.
- `writeFiles` function added to helper functions.
- Helper functions are now also available through Hoast directly, instead of requiring to be an instance.

## 0.1.0 (2018-08-21)
Initial release.