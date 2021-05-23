import section from './section.js'

export default function (hoast, { contents }) {
  return '<!DOCTYPE html><html lang="en"><head></head><body>' + section(contents) + '</body></html>'
}
