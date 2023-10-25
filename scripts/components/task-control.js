class TaskControl extends BaseHTMLElement {
  constructor() {
    super()
    console.log('进程控制 web component 被创建了')
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
        @import url('../../styles/variable.css');
        @import url('../../styles/main.css');
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
      </style>
      <div id="task_control">
        task_control
      </div>
    `
    this.shadow.appendChild(template.content.cloneNode(true))
  }
}

window.customElements.define('task-control', TaskControl)