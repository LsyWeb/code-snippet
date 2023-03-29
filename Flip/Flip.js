class Flip {
  constructor(children) {
    this.#children = [...children]
    this.init()
  }

  #children;
  #move = false;
  init() {
    if (!this.#children) return

    this.#children.forEach((child) => {
      const rect = child.getBoundingClientRect()
      child.startX = rect.left
      child.startY = rect.top
    })
  }

  /**
   * 播放动画
   * @param duration 动画时长 单位：毫秒
   */
  play(change, { duration = 500 }) {
    if (!this.#children) return
    if (this.#move) return
    this.#move = true;

    change()

    this.#children.forEach((child, i) => {
      const rect = child.getBoundingClientRect()
      const lastX = rect.left
      const lastY = rect.top

      const animation = child.animate(
        [
          {
            transform: `translate(${child.startX - lastX}px,${child.startY - lastY
              }px)`,
          },
          {
            transform: `none`,
          },
        ],
        {
          duration,
          id: `${lastX}-${lastY}-${i}`,
        }
      )
      animation.onfinish = () => {
        this.init()
        this.#move = false
      }
    })
  }
}
window.Flip = Flip
