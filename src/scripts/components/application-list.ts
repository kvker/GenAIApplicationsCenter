class ApplicationList extends BaseHTMLElement {
  constructor() {
    super()
    console.log('应用列表 web component 被创建了')
    this.application_list = [] // 应用列表
    this.current_application = null // 当前正在展示的应用
    // 加载依赖
    this.loadDependences()
      .then(() => {
        this.init()
      })
      .catch(error => {
        alert(error.message || error)
      })
  }

  loadDependences() {
    return new Promise((s, j) => {
      s(1) // 这里应该删除
      // let script = document.createElement('script')
      // script.src = '/url/path/xxx.js'
      // document.body.append(script)
      // script.onload = () => {

      // }
      // script.onerror = j
    })
  }

  init() {
    this.shadow = this.attachShadow({ mode: 'open' })
    const template = document.createElement('template')
    template.innerHTML = `
      <style>
        @import url('styles/variable.css');
        @import url('styles/main.css');
        :host {
          width: 62%;
          height: 500px;
          height: 100%;
        }
        #application_list {
          width: 100%;
          height: 100%;
          background-color: beige;
          padding: var(--main_gap);
        }
        #create_application {
          width: 200px;
          height: 100%;
          background-color: antiquewhite;
        }
        .application-item {
          width: 200px;
          height: 80px;
          background-color: antiquewhite;
          margin-left: var(--main_gap);
        }
      </style>
      <ul id="application_list" class="flex-wrap"></ul>
    `
    this.shadow.appendChild(template.content.cloneNode(true))
    this.dom.application_list = this.shadow.querySelector('#application_list')
    this.dom.application_list.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement
      let application_item = target.closest('.application-item') as HTMLElement
      if (application_item) {
        this.current_application = this.application_list.find((application: Application) => application.id === application_item.id)
        app.eventHandler('application-stage', 'showApplication', this.current_application, this)
      }
    })
  }

  createApplication(application: Application) {
    this.application_list.push(application)
    const application_item = document.createElement('li')
    application_item.className = 'application-item flex aic jcc pointer'
    application_item.id = application.id
    application_item.innerHTML = application.name
    this.dom.application_list.appendChild(application_item)

    if (application.js_url) {
      const script = document.createElement('script')
      script.src = application.js_url
      document.body.append(script)
    }
  }
}

window.customElements.define('application-list', ApplicationList)