# Changelog

## 1.1.0 (unreleased)
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