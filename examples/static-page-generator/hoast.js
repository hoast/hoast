const Hoast = require(`hoast`);
const read = Hoast.read,
	  filter = require(`hoast-filter`),
	  frontmatter = require(`hoast-frontmatter`),
	  layout = require(`hoast-layout`),
	  transform = require(`hoast-transform`);

Hoast(__dirname, {
	remove: true
})	.use(filter({
		invert: true,
		patterns: `layouts/**`
	}))
	.use(read())
	.use(frontmatter())
	.use(transform({
		patterns: `**/*.md`
	}))
	.use(layout({
		directory: `layouts`,
		layout: `page.hbs`,
		patterns: `**/*.html`
	}))
	.process()
	.then(function(hoast) {
		console.log(`Process successfully completed.`);
	})
	.catch(function(error) {
		console.error(error);
	});