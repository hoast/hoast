# @hoast/process-writefiles

Write data to the filesystem.

## Install

```
$ npm install @hoast/process-writefiles
```

## Options

- `{String} directory = 'dst'` Directory path, either absolute or relative to the working directory.
- `{Object} directoryOptions = {}` [fs.mkdir options](https://nodejs.org/api/fs.html#fs_fs_mkdir_path_options_callback).
- `{String} property = 'contents'` Dot notation path to the data property which should be used as the file's contents.
- `{Object} writeOptions = { encoding: 'utf8' }` [fs.writeFile](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback).

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).
