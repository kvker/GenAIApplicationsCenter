class InfoBox extends BaseHTMLElement {
  constructor() {
    super()
    console.log('用户信息 web component 被创建了')
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
          display: block;
          width: 100%;
          height: 100%;
          margin-top: var(--main_gap);
          background-color: burlywood;
          padding: var(--main_gap);
        }
        #userinfo {
          width: 200px;
          height: 100%;
          background-color: antiquewhite;
        }
        #create_application {
          background:antiquewhite;
        }
      </style>
      <div id="info_box" class="f1 h-100 flex aic jcsb">
        <div id="userinfo">userinfo</div>
        info_box
        <div id="create_application" class="h-100">create_application</div>
      </div>
    `
    this.shadow.appendChild(template.content.cloneNode(true))
  }
}

window.customElements.define('info-box', InfoBox)