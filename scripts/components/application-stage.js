class ApplicationStage extends BaseHTMLElement {
  constructor() {
    super()
    console.log('舞台 web component 被创建了')
    this.application_list = []
    this.application_tag_list = [] // 正在存活的应用 tag
    this.live_application_tag = null // 当前正在展示的应用 tag
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
          position: fixed;
          display: block;
          height: 100%;
          padding: 20px
        }
        #stage {
          width: 90%;
          height: 90%;
          transition: transform 0.3s linear;
          background-color: antiquewhite;
        }

        .scale-0 {
          transform: scale(0);
        }

        .scale-1 {
          transform: scale(1);
        }

        #stage_controls {
          height: 60px;
          background-color: red;
        }

        #stage_min,
        #stage_max,
        #stage_close {
          width: 120px;
          height: 40px;
          background-color: bisque;
          margin-right: var(--main_gap);
        }
      </style>
      <div id="stage_mask" class="mask flex aic jcc scale-0">
        <div id="stage" class="flex-c scale-0">
          <div id="stage_controls" class="flex aic jcfe">
            <button id="stage_min" class="flex aic jcc pointer">最小化</button>
            <button id="stage_close" class="flex aic jcc pointer">关闭</button>
          </div>
          <div id="stage_application_container" class="flex aic jcc f1"></div>
        </div>
      </div>
    `
    this.shadow.appendChild(template.content.cloneNode(true))
    this.dom.stage_mask = this.shadow.querySelector('#stage_mask')
    this.dom.stage = this.shadow.querySelector('#stage')
    this.dom.stage_min = this.shadow.querySelector('#stage_min')
    this.dom.stage_close = this.shadow.querySelector('#stage_close')
    this.dom.stage_application_container = this.shadow.querySelector('#stage_application_container')


    this.dom.stage_min.addEventListener('click', () => {
      // stage.classList.remove('scale-1')
      // stage.classList.add('scale-0')
      alert('暂未实现')
      this.doMinimize.call(this)
    })

    this.dom.stage_close.addEventListener('click', () => {
      this.doClose.call(this)
    })
  }

  createApplication(application) {
    this.application_list.push(application)
  }

  showApplication(application) {
    this.dom.stage_mask.classList.remove('scale-0')
    this.dom.stage.classList.remove('scale-0')
    this.dom.stage.classList.add('scale-1')
    this.live_application_tag = this.application_tag_list.find(item => item.id === application.id)
    if(this.live_application_tag) {
      this.dom.stage.append(this.live_application_tag)
    } else {
      this.live_application_tag = document.createElement(application.tag)
      this.live_application_tag.id = application.id
      this.dom.stage_application_container.append(this.live_application_tag)
      this.application_tag_list.push(this.live_application_tag)
    }
  }

  doMinimize() {
    this.dom.stage_mask.classList.add('scale-0')
    this.dom.stage.classList.remove('scale-1')
    this.dom.stage.classList.add('scale-0')
  }

  doClose() {
    this.doMinimize()
    this.live_application_tag.remove()
    this.application_tag_list.splice(this.application_tag_list.indexOf(this.live_application_tag), 1)
  }
}

window.customElements.define('application-stage', ApplicationStage)