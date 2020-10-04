# Config example

Examples on configuring and using hoast and some of its modules.

## Files

### hoast-instance.js

This example creates and exports a hoast instance which is picked up by the command line tool and processed.

Use the following command from the root directory of the repository to run the example.

```
% yarn workspace @hoast/examples run hoast-instance
```

> Underneath this will run the command line tool. See the package.json for the exact command.

### hoast-json.json

This example consists of a JSON configuration file which is picked up by the command line tool then instantiated and processed.

Use the following command from the root directory of the repository to run the example.

```
% yarn workspace @hoast/examples run hoast-json
```

> Underneath this will run the command line tool. See the package.json for the exact command.

### hoast-object.js

This example creates and exports a configuration object which is picked up by the command line tool then instantiated and processed.

Use the following command from the root directory of the repository to run the example.

```
% yarn workspace @hoast/examples run hoast-object
```

> Underneath this will run the command line tool. See the package.json for the exact command.

### hoast-process.js

This example creates a hoast instance and processes it without using the command line tool.

Use the following command from the root directory of the repository to run the example.

```
% yarn workspace @hoast/examples run hoast-process
```

> Underneath this will run node directly on the file since it creates and runs the core package directly. See the package.json for the exact command.
