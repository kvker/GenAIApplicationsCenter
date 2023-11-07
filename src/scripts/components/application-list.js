"use strict";
class ApplicationList extends BaseHTMLElement {
    constructor() {
        super();
        console.log('应用列表 web component 被创建了');
        this.application_list = []; // 应用列表
        this.current_application = null; // 当前正在展示的应用
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
          width: 62%;
          height: 500px;
          height: 100%;
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
        .cutom-application-item {
          background-color: ivory;
        }
      </style>
      <ul id="application_list" class="flex-wrap"></ul>
    `;
        this.shadow.appendChild(template.content.cloneNode(true));
        this.dom.application_list = this.shadow.querySelector('#application_list');
        this.dom.application_list.addEventListener('click', (e) => {
            const target = e.target;
            let application_item = target.closest('.application-item');
            if (application_item) {
                this.current_application = this.application_list.find((application) => application.id === application_item.id);
                app.eventHandler('application-stage', 'showApplication', this.current_application, this);
            }
        });
        this.dom.application_list.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const target = e.target;
            let application_item = target.closest('.application-item');
            if (application_item) {
                let application = this.application_list.find((application) => application.id === application_item.id);
                if (!application.custom)
                    return;
                this.current_application = application;
                this.deleteApplication(this.current_application);
            }
        });
    }
    createApplication(application) {
        this.application_list.push(application);
        const application_item = document.createElement('li');
        application_item.className = 'application-item flex aic jcc pointer';
        if (application.custom) {
            application_item.className += ' cutom-application-item';
        }
        application_item.id = application.id;
        application_item.innerHTML = application.name;
        this.dom.application_list.appendChild(application_item);
        if (application.js_url) {
            const script = document.createElement('script');
            script.src = application.js_url;
            document.body.append(script);
        }
    }
    updateApplication(application) {
        this.createApplication(application);
    }
    deleteApplication(application) {
        const index = this.application_list.findIndex((item) => item.id === application.id);
        if (index > -1) {
            this.application_list.splice(index, 1);
        }
        const application_item = this.dom.application_list.querySelector('#' + application.id);
        if (application_item) {
            application_item.remove();
        }
        app.eventHandler('info-box', 'deleteApplication', application);
        app.eventHandler('task-control', 'deleteApplication', application);
    }
}
window.customElements.define('application-list', ApplicationList);
