# Contributing

Welcome and thank you for wanting to contribute! Following these guidelines helps us communicate to one another more effectively so we can resolve any issues and improve the program quicker. And remember help is always welcome, if you have an idea or want to help out let us know.

## Table of contents

+ [Code of conduct](#code-of-conduct)
+ [Philosophy](#philosophy)
+ [Issues](#issues)
+ [Creating pull requests](#creating-pull-requests)
  + [Follow styling](#follow-styling)
  + [Run tests](#run-tests)
  + [Write documentation](#write-documentation)
  + [Write tests](#write-tests)
  + [Sign off commits](#sign-off-commits)
+ [Reviewing pull requests](#reviewing-pull-requests)

## Code of conduct

Besides the guidelines set out in this document we expect our community reads and follows to the [code of conduct](/CODE_OF_CONDUCT) as well.

## Philosophy

The organizations philosophy is to provide a simple yet expansive toolkit done through a modular approach preferably using minimal libraries. We hope to achieve a simple to use and easy to maintain solution.

## Issues

Before opening an issue choose the right repository. If your issue deals with a specific module go its repository.

When opening an issue via the issue tracker please use one of the templates listed below.
+ **Ask**: Ask a question. Whether something is unclear or missing we would love to help.
+ **Report**: Report a problem. Perhaps you discovered a bug and we can help fix the problem.
+ **Suggest**: Suggest an idea. Help us improve and grow the project with your suggestions.

## Creating pull requests

Before you start work on a pull request check any open pull request first then open an issue and inform us about what you want to do. Whether this is about a bug fix or new feature we would hate to see you effort go to waist. Perhaps someone is already working on fixing that bug or you wish to build a feature that is out of the scope. However do not let this discourage you from creating your own fork! We support most use-cases, but can not realistically support all, so feel free to modify the project.

To create a pull request first fork the repository, make and and commit your changes. Then create a pull request in the original repository, select the changes, fill in a short form, and submit the request. Afterwards simply wait for us to get back to you with any feedback.

When making changes make sure you do everything listed below.
+ Follow styling.
+ Run tests.
+ Write documentation.
+ Write examples.
+ Write tests.
+ Sign off commits.

### Follow styling

There is no specific styling guide to use. There are however two which can automatically be enforced by [EditorConfig](https://editorconfig.org) and [ESLint](https://eslint.org) using the `.editorconfig` and `.eslintrc.js` file respectively. Therefore you are recommend to install a plugin to automate this process. See [EditorConfig's download section](https://editorconfig.org/#download) for a list of editor extensions. Depending on your preferences you can enable the format / lint on save option in several editors as well.

### Run tests

The project uses `yarn` which has some support for monorepositories. To read more about how to run commands with yarn in a monorepository see the [yarn workspaces documentation](https://yarnpkg.com/features/workspaces) or run `% yarn workspaces -h`. Clone the repository, install dependencies with `% yarn install`, and run tests with `% yarn workspaces run test` or `% yarn workspace <package-name> run test` for a specific package.

### Write documentation

The projects documentation include four elements the instruction manual, change log, code comments, and commit messages. The first two are meant for users, and the latter two for contributors.

+ **Instruction manual**: The `README.md` introduces the project and provides instructions on how to use the package.
+ **Change log**: The `CHANGELOG.md` lists what has changed in which version. Add your changes under the `UNRELEASED` header, if not already there feel free to add it. Then create sub-headers with the type of changes either `Added`, `Changed`, `Fixed`, or `Removed` where you will list the changes.
+ **Code comments**: Code should be annotated explaining briefly what a section of code does, whereby the functionality should be understood by only reading the comments.
+ **Commit message**: Commit messages should summarize what has essentially been written to the change log.

### Write examples

In order to help people

### Write tests

Sometimes tests need to be added, improved, or updated to reflect recent changes, be sure to run the current tests and make changes if necessary. Tests can be ran using `% yarn workspaces run test` or `% yarn workspace <package-name> run test` for a specific test. GitHub actions will automatically run the tests when a pull request is submitted. Your pull request will not be merged until all test are passed.

### Sign off commits

Ensure your commits are signed off on at the end of your commit message, like so `Signed-off-by: Jean Smith <jean.smith@example.com>`. Your signature certifies that you comply with the project's [Developer Certificate of Origin](/DCO). The goal of the DCO is to make sure contributors have to legal right to submit their changes. Therefore make sure to use your real name and not a pseudonym.

> If you set your `user.name` and `user.email` git configs, you can sign your commit automatically with `git commit -s` command or in Visual Studio Code use the `Commit All (Signed Off)` or `Commit Stages (Signed Off)` option.

## Reviewing pull requests

Before a pull request is allowed to be merged into the master branch at least one other contributor has to review and approve the changes made.

+ Changes follow styling.
+ Documentation is up to date.
+ Tests are up to date.
+ Tests run successfully.
+ Commits are signed off.
