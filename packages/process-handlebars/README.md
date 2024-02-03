# @hoast/process-handlebars

Template using [Handlebars](https://github.com/handlebars-lang/handlebars.js#readme).

## Install

```ZSH
npm install @hoast/process-handlebars
```

## Options

- `{String} property = 'contents'` Dot notation path to the data property which should be used processed by handlebars.
- `{String} templateDirectory = null` Template directory path, either absolute or relative to the working directory.
- `{String} templatePath = null` Default template path relative to the template directory.
- `{String} templateProperty = null` Dot notation path to the data property where the template path can be written.
- `{Object} handlebarsOptions = {}` [Handlebars options](https://github.com/handlebars-lang/handlebars.js#readme).
- `{Object} helpers = null` Object of Handlebars helpers whereby the key is the name of the helper and the value the helper function.
- `{String} helpersDirectory = null` Handlebars helpers directory path, either absolute or relative to the working directory. All items in the directory will be read where the path relative to the given directory is the name of the helper and the default export of the file the helper.
- `{Object} partials = null` Object of Handlebars parials whereby the key is the name of the parial and the value the partial contents.
- `{String} partialsDirectory = null` Handlebars partials directory path, either absolute or relative to the working directory. All items in the directory will be read where the path relative to the given directory is the name of the partial and the contents of the file the partial.

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/main/packages/utils#logger.js).
