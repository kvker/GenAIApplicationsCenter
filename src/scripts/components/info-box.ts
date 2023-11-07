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
          background-color: burlywood;
          padding: var(--main_gap);
        }
        .qr-code {
          width: auto;
          height: 120px;
        }
        #create_application {
          background:antiquewhite;
        }
      </style>
      <div id="info_box" class="f1 h-100">
        <div id="userinfo_box" class="w-100 h-100 flex aic jcfe">
          <div class="text-right mr-20">
            <p class="mb-20">诚邀AI应用玩家、设计师</P>
            <p>AI应用中心沟通群</P>
          </div>
          <img class="qr-code" src="images/qr-code.png">
        </div>
      </div>
    `
    this.shadow.appendChild(template.content.cloneNode(true))

    this.dom.userinfo_box = this.shadow.querySelector('#userinfo_box')
    this.dom.no_userinfo_box = this.shadow.querySelector('#no_userinfo_box')
  }

  doLogin() {
    let username = prompt('请输入账号')
    if (username) {
      let password = prompt('请输入密码')
      if (password) {
        lc.login(username, md5(password))
          .then((user: LCUser) => this.handlerLogin())
      }
    }
  }

  handlerLogin() {
    this.dom.no_userinfo_box.classList.add('none')
    this.dom.userinfo_box.classList.remove('none')

    this.updateUserinfoBox()
  }

  handlerLogout() {
    this.dom.userinfo_box.classList.add('none')
    this.dom.no_userinfo_box.classList.remove('none')
  }

  updateUserinfoBox() {
    let userinfo_box = this.dom.userinfo_box
    userinfo_box.querySelector('.avatar').src = lc.currentUser().get('avatar_url')
    userinfo_box.querySelector('.username').innerText = lc.currentUser().get('username')
    userinfo_box.querySelector('.integration').innerText = lc.currentUser().get('integration') + '步'
  }
}

window.customElements.define('info-box', InfoBox)