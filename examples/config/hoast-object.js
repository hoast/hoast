export default {
  collections: [{
    source: ['@hoast/source-readfiles', {
      directory: 'src',
    }],
    processes: [
      '@hoast/process-log',
    ],
  }],
}
