"use strict";
class TaskControl extends BaseHTMLElement {
    constructor() {
        super();
        console.log('进程控制 web component 被创建了');
        this.application_list = [];
        this.current_application = null; // 当前正在展示的应用
        this.application_dom_list = []; // 应用 tag 列表
        this.current_application_dom = null; // 当前正在展示的应用 tag
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
        template.innerHTML = `
      <style>
        @import url('styles/variable.css');
        @import url('styles/main.css');
        :host {
          flex: 1;
          height: 500px;
          height: 100%;
          margin-left: var(--main_gap);
        }
        #task_control {
          width: 100%;
          height: 100%;
          padding: var(--main_gap);
          border: 1px solid #FFFFFF;
        }
        #task_application_list {
          width: 100%;
          height: 100%;
        }
        .task-titles {
          border-bottom: 1px solid white;
          padding-bottom: 10px;
        }
        .application-item {
          width: 100%;
          height: 44px;
        }
        .highlight {
          background: white;
        }
        @media screen and (max-width: 768px) {
          .create-time, .application-item-time {
            display: none;
          }
        }
      </style>
      <div id="task_control" class="flex-c aic jcsb">
        <div class="flex aic jcsb w-100 task-titles">
          <p>应用名</p>
          <p class="create-time">创建时间</p>
        </div>
        <ul id="task_application_list" class="w-100"></ul>
      </div>
    `;
        this.shadow.appendChild(template.content.cloneNode(true));
        this.dom.application_list = this.shadow.querySelector('#task_application_list');
        this.dom.application_list.addEventListener('click', (e) => {
            const target = e.target;
            let application_item = target.closest('.application-item');
            if (application_item) {
                let application = this.application_list.find((i) => i.id === application_item.id);
                this.highlightApplication(application);
                app.eventHandler('application-stage', 'showApplication', this.current_application, this);
            }
        });
    }
    createApplication(application) {
        this.current_application = this.application_list.find((i) => i.id === application.id);
        if (!this.current_application) {
            this.application_list.push(application);
            this.current_application = application;
            const li = document.createElement('li');
            li.classList.add('application-item', 'flex', 'aic', 'jcsb', 'pointer');
            li.id = application.id;
            li.innerHTML = `
        <div class="application-item-name">${application.name}</div>
        <div class="application-item-time">${dayjs().format('HH:MM:ss')}</div>
      `;
            this.dom.application_list.append(li);
            this.application_dom_list.push(li);
        }
    }
    updateApplication(application) {
        this.current_application = application;
        alert('注册应用');
    }
    readApplication(application) {
        this.current_application = application;
        alert('读取应用');
    }
    deleteApplication(application) {
        this.current_application = application;
        this.current_application_dom = this.application_dom_list.find((i) => i.id === application.id);
        if (!this.current_application_dom)
            return;
        this.current_application_dom.remove();
        this.application_dom_list.splice(this.application_dom_list.indexOf(this.current_application_dom), 1);
        this.application_list.splice(this.application_list.indexOf(this.current_application), 1);
        this.current_application = null;
    }
    highlightApplication(application) {
        this.current_application = application;
        this.current_application_dom = this.getCurrentApplicationDom();
        this.current_application_dom.classList.add('highlight');
        setTimeout(() => {
            this.application_dom_list.forEach((i) => i.classList.remove('highlight'));
        }, 1000);
    }
    getCurrentApplicationDom() {
        return this.application_dom_list.find((i) => i.id === this.current_application.id);
    }
}
window.customElements.define('task-control', TaskControl);
