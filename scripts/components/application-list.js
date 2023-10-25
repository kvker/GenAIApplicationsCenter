class ApplicationList extends BaseHTMLElement {
  constructor() {
    super()
    console.log('应用列表 web component 被创建了')
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
      s() // 这里应该删除
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
    this.dom.application_list.addEventListener('click', (e) => {
      const target = e.target
      let application_item = target.closest('.application-item')
      if(application_item) {
        app.eventHandler('application-stage', 'showApplication', application_item.application, this)
      }
    })
  }

  createApplication(application) {
    const application_item = document.createElement('li')
    application_item.className = 'application-item flex aic jcc pointer'
    application_item.id = application.target_id
    application_item.innerHTML = application.name
    application_item.application = application
    this.dom.application_list.appendChild(application_item)

    const script = document.createElement('script')
    script.src = application.js_url
    document.body.append(script)
    script.onload = () => {
      app.eventHandler('application-stage', 'createApplication', application, this)
    }
  }
}

window.customElements.define('application-list', ApplicationList)