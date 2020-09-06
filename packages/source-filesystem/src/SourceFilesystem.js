// import { parse, match } from 'planckmatch'

class SourceFilesystem {
  constructor(options) {
    this.options = Object.assign({
      directory: 'src',
      patterns: [],
    }, options)
  }

  iterate () {
    if (!this.initialized) {
      this.initialized = true
    }

    // TODO:
  }

  finally () {
    this.initialized = false
  }
}

export default SourceFilesystem
