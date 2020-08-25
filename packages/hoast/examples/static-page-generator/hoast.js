// Get hoast module.
const Hoast = require('hoast')
// Get all modules.
const read = Hoast.read
const frontmatter = require('hoast-frontmatter')
const layout = require('hoast-layout')
const transform = require('hoast-transform')

Hoast(__dirname, {
  // Whenever you generate a build clean out the destination directory beforehand.
  remove: true,
  // Remove all layouts files from being further processed, by accepting all file paths except for those that start out in the layout directory.
  patterns: [
    '*',
    '!(layouts/*)',
  ],
  patternOptions: {
    // All patterns need to be true in order to pass.
    all: true,
    // Use extended glob patterns so you can use symbols such as explanation marks.
    extended: true,
  },
})
  .use(read())
  .use(frontmatter())
  // For the `transform` module to accept handlebar files the `jstransformer-markdown-it` module needs to be installed.
  // See the `package.json` for additional information as well.
  .use(transform({
    // All files with the markdown extension.
    patterns: '*.md',
  }))
  // For the `layout` module to accept handlebar files the `jstransformer-handlebars` module needs to be installed.
  // See the `package.json` for additional information as well.
  .use(layout({
    // All layouts can be found in the layouts directory.
    directory: 'layouts',
    // The default layout is `page.hbs`.
    layout: 'page.hbs',
    // All files with the HTML extension.
    patterns: '*.html',
  }))
  // Start processing the files.
  .process()
  // Called when process has finished.
  .then(function(hoast) {
    // Process successfully completed.
    console.log('Process successfully finished!')
  })
  // Called if an error occurred during the process.
  .catch(function(error) {
    // Error received during process.
    console.error(error)
  })
