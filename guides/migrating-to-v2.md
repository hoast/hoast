# Migrating to v2

Version 2 has been a complete rewrite from version 1. The rewrite has come with several benefits the largest one being that collections are sourced via modular packages. A source package does not have to be tied to the filesystem and can therefore fetch data from varying sources for example from external API.

As a result of the complete rewrite the packages have also drastically changed. Some notable to them changes are:
- The generic layout and transformer packages has been deprecated in order to focus more on creating better integration with the library used for transformation. An example of this is the new handlebars and markdown packages.
- The changed package is also deprecated it never worked well and was rather unreliable. I will think about a different optimization strategy whick will most likely be done on a source or process package level. Suggestions are as always welcome.
- Filtering can now be done on a package by package basis thanks to the `base-process` package which is inherited by most process packages. As a result a step can be skipped in the processes. This change removes the need for a seprate collection if a single process is different for a few items in a collection.
- Minification can now handled by a postprocess package which also accepts other babel and postcss plugins for transformation of your style sheets and scripts.

If you want to migrate to the new version you will unfortunately need to rewrite the configuration file. An overview of all packages can be found in the [packages directory](/packages).
