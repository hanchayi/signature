import { a } from './test'

export default class Signature {
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
      this.debug('mousemove', point)
      this.draw(point)
    })
    this.addEventListener(this.canvas, 'touchmove', (e) => {
      const point = this.getEventPoint(e)
      this.debug('touchmove', e)
      this.draw(point)
    })
  }

  draw(point) {
    this.context.lineTo(point.x, point.y)
    this.context.stroke()
  }

  stopDraw() {
    if (this.state !== 'draw') {
      return
    }

    this.removeEventListeners('mousemove')
    this.state = ''
  }

  getEventPoint(e) {
    // 兼容移动端
    if (e instanceof TouchEvent) {
      const rect = this.canvas.getBoundingClientRect()
      return {
        x: e.targetTouches[0].clientX - rect.left,
        y: e.targetTouches[0].clientY - rect.top
      }
    }

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
      e.preventDefault()
      this.debug('mousedown', e)
      this.startDraw(this.getEventPoint(e))
    })
    this.addEventListener(this.canvas, 'touchstart', (e) => {
      e.preventDefault()
      this.debug('touchstart', e)
      this.startDraw(this.getEventPoint(e))
    })
    this.addEventListener(document, 'mouseup', (e) => {
      this.debug('mouseup', e)
      e.preventDefault()
      this.stopDraw()
    })
    this.addEventListener(this.canvas, 'touchend', (e) => {
      e.preventDefault()
      this.debug('touchend', e)
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

  debug(...args) {
    console.log(...args)
  }

  destroy() {
    this.removeEventListeners()
    this.listeners = null
    this.context = null
    this.canvas = null
    this.state = ''
  }
}