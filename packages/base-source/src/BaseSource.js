// Import base class.
import BasePackage from '@hoast/base-package'
import deepAssign from '@hoast/utils/deepAssign.js'

class BaseSource extends BasePackage {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(...options) {
    super({
      splitAt: null,
      splitDataProperty: 'segment',
      splitProperty: 'contents',
    }, ...options)

    const {
      splitAt,
      splitDataProperty,
      splitProperty,
    } = this.getOptions()

    this._hasInitialize = typeof (this.initialize) === 'function'
    this._hasSequential = typeof (this.sequential) === 'function'
    this._hasConcurrent = typeof (this.concurrent) === 'function'

    this._hasSplit = (
      splitAt &&
      splitDataProperty &&
      splitProperty
    )

    this._reset()
  }

  _reset () {
    this._concurrentCount = 0
    this._holdCalls = false
    this._isInitialized = false
    this._itemsCache = []
    this._promiseQueue = []
    this.exhausted = false
  }

  _split (data) {
    const {
      splitAt,
      splitDataProperty,
      splitProperty,
    } = this.getOptions()

    if (
      data &&
      data[splitProperty]
    ) {
      const splitContents = data[splitProperty].split(splitAt)
      this._itemsCache = splitContents
        .map((content, index) => deepAssign({}, data, {
          [splitProperty]: content,
          [splitDataProperty]: {
            length: splitContents.length,
            index,
          },
        }))

      data = this._itemsCache.shift()
    }

    return data
  }

  isDone (
  ) {
    return (
      this.exhausted &&
      (
        !this._hasConcurrent ||
        this._concurrentCount === 0
      ) && (
        !this._itemsCache ||
        this._itemsCache.length === 0
      )
    )
  }

  isExhausted (
  ) {
    return (
      this.exhausted &&
      !this._holdCalls && (
        !this._itemsCache ||
        this._itemsCache.length === 0
      )
    )
  }

  /**
   * This will be called by hoast itself to retrieve the next item.
   * @returns {Any} Retrieved data.
   */
  async next (
  ) {
    // Exit early if done.
    if (this.isDone()) {
      return
    }

    // If an item exists in the cache return it.
    if (
      this._itemsCache &&
      this._itemsCache.length > 0
    ) {
      return this._itemsCache.shift()
    }

    // If there is no initialization and sequential step then run this now.
    if (
      (!this._hasInitialize ||
        this._isInitialized
      ) &&
      !this._hasSequential
    ) {
      let data = await this.concurrent()
      if (this._hasSplit) {
        data = this._split(data)
      }
      return data
    }

    // Check if calls should be held.
    if (this._holdCalls) {
      return await new Promise((resolve, reject) => {
        this._promiseQueue.push({
          resolve,
          reject,
        })
      })
    }
    this._holdCalls = true

    // Try initialization.
    if (
      this._hasInitialize &&
      !this._isInitialized
    ) {
      await this.initialize()
      this._isInitialized = true
    }

    const iterate = async () => {
      let data = null
      if (this._hasSequential) {
        data = await this.sequential()
      }

      // If a split can happen finish, first source fully since it might contain the data that will be split.
      if (this._hasSplit) {
        if (this._hasConcurrent) {
          this._concurrentCount++
          data = await this.concurrent(data)
          this._concurrentCount--
        }
        data = this._split(data)
      }

      if (
        this._hasInitialize ||
        this._hasSequential
      ) {
        // If an item exists in the cache then resolve those first.
        if (
          this._itemsCache &&
          this._itemsCache.length > 0
        ) {
          const length = (
            this._promiseQueue.length < this._itemsCache.length
              ? this._promiseQueue.length
              : this._itemsCache.length
          )
          for (let i = 0; i < length; i++) {
            const promise = this._promiseQueue.shift()
            const item = this._itemsCache.shift()
            setTimeout(() => {
              promise.resolve(item)
            }, 0)
          }
        }

        // Immediately resolve all queued promises if exhausted.
        if (this.exhausted) {
          let promise
          while (promise = this._promiseQueue.shift()) {
            promise.resolve(null)
          }
          // Set hold back to false.
          this._holdCalls = false
        } else if (this._promiseQueue.length > 0) {
          // Continue iterating in order to resolve the queued calls.
          const promise = this._promiseQueue.shift()
          try {
            promise.resolve(iterate())
          } catch (error) {
            promise.reject(error)
          }
        } else {
          // Set hold back to false.
          this._holdCalls = false
        }
      }

      // If the concurrency hasn't ran yet do it now.
      if (
        this._hasConcurrent &&
        !this._hasSplit
      ) {
        this._concurrentCount++
        data = await this.concurrent(data)
        this._concurrentCount--
      }

      return data
    }

    return await iterate()
  }

  final (
  ) {
    this._reset()
  }
}

export default BaseSource
