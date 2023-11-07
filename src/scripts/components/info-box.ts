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
    let user = null //lc.currentUser()
    template.innerHTML = `
      <style>
        @import url('styles/variable.css');
        @import url('styles/main.css');
        :host {
          display: block;
          width: 100%;
          height: 200px;
          margin-top: var(--main_gap);
          padding: var(--main_gap);
          border: 1px solid #FFFFFF;
        }
        .button-primary {
          width: 120px;
        }
        .button-create {
          margin-right: auto;
        }
        .qr-code {
          width: auto;
          height: 120px;
        }
        #create_application {
          background:antiquewhite;
        }

        .form {
          padding: 20px;
          background: white;
          border-radius: 8px;
          width: 100%;
          max-width: 400px;
        }

        .form input, .form textarea {
          width: 100%;
        }

        .form input {
          padding: 0 10px;
        }

        .form textarea {
          height: 100px;
          padding: 10px;
        }

        @media screen and (max-width: 768px) {
          .mask {
            padding: var(--main_gap);
          }
        }
      </style>
      <div id="info_box" class="f1 h-100">
        <div class="w-100 h-100 flex aic jcfe">
          <button class="button-primary button-create">创建AI应用</button>
          <div class="text-right mr-20">
            <p class="mb-10">AI玩家</P>
            <p>沟通群</P>
          </div>
          <img class="qr-code" src="images/qr-code.png">
        </div>
        <div class="mask flex aic jcc none">
          <div class="form flex-c aic jcc">
            <p class="w-100">应用名称</p>
            <input class="mb-20 mt-10 name" placeholder="如：小学语文老师" value="小学语文老师">
            <p class="w-100">AI身份与适当的解释</p>
            <textarea class="mb-20 mt-10 identity" placeholder="如：\n现在你是小学语文老师，职能是进行作业批改和点评，下面是我提供给你的作业内容。">现在你是小学语文老师，职能是进行作业批改和点评，下面是我提供给你的作业内容。</textarea>
            <p class="w-100">对AI的要求</p>
            <textarea class="mb-20 mt-10 request" placeholder="请按照1、2、3、...的形式，如：\n1、检测语法错误，并告知修改方案；2、检测错别字，并告知修改方案。">1、检测语法错误，并告知修改方案；2、检测错别字，并告知修改方案。</textarea>
            <p class="w-100">给用户的提示语</p>
            <textarea class="mb-20 mt-10 placeholder" placeholder="根据上面内容提示用户，如：\n请输入小学语文作文内容。">请输入小学语文作文内容。</textarea>
            <button class="button-primary button-submit mt-20">创建自己的AI应用</button>
          </div>
        </div>
      </div>
    `
    this.shadow.appendChild(template.content.cloneNode(true))

    this.dom.name = this.shadow.querySelector('.name')
    this.dom.identity = this.shadow.querySelector('.identity')
    this.dom.request = this.shadow.querySelector('.request')
    this.dom.placeholder = this.shadow.querySelector('.placeholder')

    this.dom.mask = this.shadow.querySelector('.mask')
    this.dom.mask.addEventListener('click', (e: MouseEvent) => {
      if (e.target === this.dom.mask) {
        this.dom.mask.classList.add('none')
      }
    })

    this.dom.button_create = this.shadow.querySelector('.button-create')
    this.dom.button_create.addEventListener('click', () => {
      this.dom.mask.classList.remove('none')
    })

    this.dom.button_submit = this.shadow.querySelector('.button-submit')
    this.dom.button_submit.addEventListener('click', () => {
      this.doSubmit()
    })
  }

  doSubmit() {
    const application = this.createApplication()
    if (!application) return
    app.eventHandler('application-list', 'updateApplication', application)
    this.dom.mask.classList.add('none')
  }

  createApplication(): Application | undefined {
    let application: Application = {
      id: 'custom' + Date.now() + '',
      name: this.dom.name.value,
      placeholder: this.dom.placeholder.value,
      pre_content: this.dom.identity.value,
      tail_content: this.dom.request.value,
      custom: true,
    }

    if (!application.name) {
      alert('请输入应用名称')
      return
    }
    if (!application.placeholder) {
      alert('请输入提示语')
      return
    }
    if (!application.pre_content) {
      alert('请输入AI身份与适当的解释')
      return
    }
    if (!application.tail_content) {
      alert('请输入对AI的要求')
      return
    }
    let application_list_string = localStorage.getItem('application_list') || '[]'
    let application_list: Application[] = JSON.parse(application_list_string)
    application_list.push(application)
    localStorage.setItem('application_list', JSON.stringify(application_list))
    return application
  }

  deleteApplication(application: Application) {
    let application_list = JSON.parse(localStorage.getItem('application_list') || '[]')
    let index = application_list.findIndex((item: Application) => item.id === application.id)
    if (index > -1) {
      application_list.splice(index, 1)
    }
    localStorage.setItem('application_list', JSON.stringify(application_list))
  }
}

window.customElements.define('info-box', InfoBox)