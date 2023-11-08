// 这里是终端代理总线
// 用于处理终端代理的事件
// 各个组件之间的函数调用统一从这里进行

let app = new class App {
  constructor() {
    this.init()
  }

  init() {
    window.application_list.forEach((application: Application) => {
      this.eventHandler('application-list', 'createApplication', application)
    })
  }

  /**
   * 跨组件调用器
   * @param {*} wc_query web component query
   * @param {*} event 执行函数
   * @param {*} data 参数
   * @param {*} dispatcher 调用者
   */
  eventHandler(wc_query: string, event: string, data: BaseObject, dispatcher?: HTMLElement) {
    // 部分功能需要登录才能调用
    // if(!lc.currentUser()) {
    //   alert('需要先登录')
    //   return
    // }
    let target = document.querySelector(wc_query)
    let handler = target && target[event]
    handler && handler.call(target, data)
    // console.log({ dispatcher })
  }
}