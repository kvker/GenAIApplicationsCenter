// 这里是终端代理总线
// 用于处理终端代理的事件
// 各个组件之间的函数调用统一从这里进行

let app = new class App {
  constructor() {
    this.init()
  }

  init() {
    window.application_list.forEach(application => {
      this.eventHandler('application-list', 'createApplication', application, this )
    })
  }

  /**
   * 跨组件调用器
   * @param {*} wc_query web component query
   * @param {*} event 执行函数
   * @param {*} data 参数
   * @param {*} dispatcher 调用者
   */
  eventHandler(wc_query, event, data, dispatcher) {
    let target = document.querySelector(wc_query)
    let handler = target && target[event]
    handler && handler.call(target, data)
    // console.log({ dispatcher })
  }
}