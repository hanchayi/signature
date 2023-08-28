import { a } from './test'

export default class Signature {
  constructor(canvas) {
    this.canvas = canvas
    this.listeners = []
    this.init()
  }

  init() {
    this.initListeners()
  }

  initListeners() {
    this.addEventListener('mousedown', () => {
      console.log('mousedown')
    })
    this.addEventListener('mouseup', () => {
      console.log('mouseup')
    })
  }

  addEventListener(event, listener) {
    this.canvas.addEventListener(event, listener)
    this.listeners.push({
      event,
      listener
    })
  }

  destroy() {
    this.listeners.forEach(({ listener, event }) => {
      this.canvas.removeEventListener(event, listener)
    })
  }
}