class TemplateWC extends BaseHTMLElement {
  constructor() {
    super()
    console.log('试题变更检索web component被创建了')
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
          display: block;
          width: 100%;
          height: 100%;
          padding: 20px
        }
      </style>
      <div id=Template_container" class="flex-c h-100"></div>
    `
    this.shadow.appendChild(template.content.cloneNode(true))
  }
}

window.customElements.define('template-wc', TemplateWC)