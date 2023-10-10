class FullScreen {
  constructor(el, options = {}) {
    const { onChange, onEnter, onExit } = options;
    this.el = el;
    this.options = {
      onChange,
      onEnter,
      onExit,
    }
    this._init();
  }

  _funcNames = [
    "requestFullscreen",
    "webkitRequestFullscreen",
    "mozRequestFullScreen",
    "msRequestFullscreen",
  ];

  _exitFuncNames = [
    "exitFullscreen",
    "webkitExitFullscreen",
    "mozCancelFullScreen",
    "msExitFullscreen",
  ];

  _fullScreenNames = [
    "fullscreenElement",
    "webkitFullscreenElement",
    "mozFullScreenElement",
    "msFullscreenElement",
  ];

  _init() {
    this._enterProptypeName = this._getProptypeName(
      this._funcNames,
      document.documentElement,
    );
    this._exitProptypeName = this._getProptypeName(this._exitFuncNames);
  }

  _getProptypeName(names, target = document) {
    return names.find((name) => name in target);
  }

  fullEle() {
    const name = this._getProptypeName(this._fullScreenNames);
    return document[name];
  }

  isFull() {
    return !!this.fullEle();
  }

  toogle() {
    this.isFull() ? this.exit() : this.enter();
  }

  enter() {
    this._enterProptypeName && this.el[this._enterProptypeName]();
    this.options?.onEnter && this.options.onEnter();
    this.options?.onChange && this.options.onChange();
  }

  exit() {
    this._exitProptypeName && document[this._exitProptypeName]();
    this.options?.onEnter && this.options.onExit();
    this.options?.onChange && this.options.onChange();
  }
}

export default FullScreen;
