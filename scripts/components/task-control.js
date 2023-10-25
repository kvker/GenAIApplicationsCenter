class TaskControl extends BaseHTMLElement {
  constructor() {
    super()
    console.log('进程控制 web component 被创建了')
    this.application_list = []
    this.current_application = null // 当前正在展示的应用
    this.application_dom_list = [] // 应用 tag 列表
    this.current_application_dom = null // 当前正在展示的应用 tag
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
          flex: 1;
          height: 500px;
          margin-left: var(--main_gap);
        }
        #task_control {
          width: 100%;
          height: 100%;
          background-color: blanchedalmond;
          padding: var(--main_gap);
        }
        #application_list {
          width: 100%;
          height: 100%;
        }
        .application-item {
          width: 100%;
          height: 44px;
        }
        .highlight {
          border: 1px solid red;
        }
      </style>
      <div id="task_control" class="flex-c aic jcsb">
        <div class="flex aic jcsb w-100">
          <p>应用名</p>
          <p>创建时间</p>
        </div>
        <ul id="application_list" class="w-100"></ul>
      </div>
    `
    this.shadow.appendChild(template.content.cloneNode(true))

    this.dom.application_list = this.shadow.querySelector('#application_list')
    this.dom.application_list.addEventListener('click', (e) => {
      const target = e.target
      let application_item = target.closest('.application-item')
      if(application_item) {
        this.highlightApplication(application_item)
        app.eventHandler('application-stage', 'showApplication', this.current_application, this)
      }
    })
  }

  createApplication(application) {
    this.current_application = this.application_list.find(i => i.id === application.id)
    if(!this.current_application) {
      this.application_list.push(application)
      this.current_application = application
      const li = document.createElement('li')
      li.classList.add('application-item', 'flex', 'aic', 'jcsb')
      li.id = application.id
      li.innerHTML = `
        <div class="application-item-name">${application.name}</div>
        <div class="application-item-time">${Date.now()}</div>
      `
      this.dom.application_list.append(li)
      this.application_dom_list.push(li)
    }
  }

  updateApplication(application) {
    this.current_application = application
    alert('注册应用')
  }

  readApplication(application) {
    this.current_application = application
    alert('读取应用')
  }

  deleteApplication(application) {
    this.current_application = application
    this.current_application_dom = this.application_dom_list.find(i => i.id === application.id)
    this.current_application_dom.remove()
    this.application_dom_list.splice(this.application_dom_list.indexOf(this.current_application_dom), 1)
    this.application_list.splice(this.application_list.indexOf(this.current_application), 1)
    this.current_application = null
  }

  highlightApplication(application) {
    this.current_application = application
    this.current_application_dom = this.getCurrentApplicationDom()
    this.current_application_dom.classList.add('highlight')
    setTimeout(() => {
      this.current_application_dom.classList.remove('highlight')
    }, 2000)
  }

  getCurrentApplicationDom() {
    return this.application_dom_list.find(i => i.id === this.current_application.id)
  }
}

window.customElements.define('task-control', TaskControl)