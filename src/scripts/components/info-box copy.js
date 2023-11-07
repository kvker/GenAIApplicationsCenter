"use strict";
class InfoBox extends BaseHTMLElement {
    constructor() {
        super();
        console.log('用户信息 web component 被创建了');
        // 加载依赖
        this.loadDependences()
            .then(() => {
            this.init();
        })
            .catch(error => {
            alert(error.message || error);
        });
    }
    loadDependences() {
        return new Promise((s, j) => {
            s(1); // 这里应该删除
            // let script = document.createElement('script')
            // script.src = '/url/path/xxx.js'
            // document.body.append(script)
            // script.onload = () => {
            // }
            // script.onerror = j
        });
    }
    init() {
        this.shadow = this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        let user = null; //lc.currentUser()
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
        #userinfo {
          width: 200px;
          height: 100%;
          background-color: antiquewhite;

          .avatar {
            width: 80px;
            height: 80px;
            object-fit: cover;
          }

          .username {
            color: red;
          }

          .integration {
            color: blue;
          }
        }
        #create_application {
          background:antiquewhite;
        }
      </style>
      <div id="info_box" class="f1 h-100">
        <div id="userinfo_box" class="w-100 h-100 ${user ? '' : 'none'} flex aic jcsb">
          <div id="userinfo">
            <img class="avatar" src="">
            <p class="username"></p>
            <p class="integration"></p>
          </div>
          info_box
          <div id="create_application" class="h-100">create_application</div>
        </div>
        <div id="no_userinfo_box" class="flex aic jcc h-100 pointer underline ${user ? 'none' : ''}">点击登录</div>
      </div>
    `;
        this.shadow.appendChild(template.content.cloneNode(true));
        this.dom.userinfo_box = this.shadow.querySelector('#userinfo_box');
        this.dom.no_userinfo_box = this.shadow.querySelector('#no_userinfo_box');
        this.dom.no_userinfo_box.addEventListener('click', (e) => {
            this.doLogin();
        });
        user && this.updateUserinfoBox();
    }
    doLogin() {
        let username = prompt('请输入账号');
        if (username) {
            let password = prompt('请输入密码');
            if (password) {
                lc.login(username, md5(password))
                    .then((user) => this.handlerLogin());
            }
        }
    }
    handlerLogin() {
        this.dom.no_userinfo_box.classList.add('none');
        this.dom.userinfo_box.classList.remove('none');
        this.updateUserinfoBox();
    }
    handlerLogout() {
        this.dom.userinfo_box.classList.add('none');
        this.dom.no_userinfo_box.classList.remove('none');
    }
    updateUserinfoBox() {
        let userinfo_box = this.dom.userinfo_box;
        userinfo_box.querySelector('.avatar').src = lc.currentUser().get('avatar_url');
        userinfo_box.querySelector('.username').innerText = lc.currentUser().get('username');
        userinfo_box.querySelector('.integration').innerText = lc.currentUser().get('integration') + '步';
    }
}
window.customElements.define('info-box', InfoBox);
