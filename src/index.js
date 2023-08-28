import { a } from './test'

export default class Signature {
  /**
   * canvas元素
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.state = ''
    if (!canvas) {
      throw new Error('no canvas element')
    }
    this.canvas = canvas
    if (!this.canvas.getContext) {
      throw new Error('not support canvas')
    }
    this.context = this.canvas.getContext('2d')
    this.listeners = []
    this.init()
  }

  startDraw(startPoint) {
    if (this.state === 'draw') {
      return
    }
    this.state = 'draw'
    this.context.beginPath()
    this.context.moveTo(startPoint.x, startPoint.y)
    this.addEventListener(this.canvas, 'mousemove', (e) => {
      const point = this.getEventPoint(e)
      console.log('mousemove', point)
      this.context.lineTo(point.x, point.y)
      this.context.stroke()
    })
  }

  stopDraw() {
    if (this.state !== 'draw') {
      return
    }

    this.removeEventListeners('mousemove')
    this.state = ''
  }

  getEventPoint(e) {
    return {
      x: e.offsetX,
      y: e.offsetY
    }
  }

  init() {
    this.initListeners()
  }

  initListeners() {
    this.addEventListener(this.canvas, 'mousedown', (e) => {
      console.log('mousedown', e)
      this.startDraw(this.getEventPoint(e))
    })
    this.addEventListener(document, 'mouseup', () => {
      console.log('mouseup')
      this.stopDraw()
    })
  }

  addEventListener(target, event, listener) {
    target.addEventListener(event, listener)
    this.listeners.push({
      target,
      event,
      listener
    })
  }

  removeEventListeners(targetEvent) {
    for (let i = 0; i < this.listeners.length; i++) {
      const { event, listener, target } = this.listeners[i]

      // 指定事件
      if (targetEvent && targetEvent !== event) {
        continue
      }

      target.removeEventListener(event, listener)
      this.listeners.splice(i, 1)
    }
  }

  destroy() {
    this.removeEventListeners()
    this.listeners = null
    this.context = null
    this.canvas = null
    this.state = ''
  }
}