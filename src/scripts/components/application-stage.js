"use strict";
class ApplicationStage extends BaseHTMLElement {
    constructor() {
        super();
        console.log('舞台 web component 被创建了');
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
          position: fixed;
          display: block;
          height: 100%;
        }
        #stage {
          width: 90%;
          height: 90%;
          transition: transform 0.3s linear;
          background: linear-gradient(180deg, #f0f9ff 0%, #ebe8ff 100%);
        }

        .scale-0 {
          transform: scale(0);
        }

        .scale-1 {
          transform: scale(1);
        }

        #stage_controls {
          height: 60px;
          border-bottom: 1px solid #FFFFFF;
        }

        #stage_min,
        #stage_max,
        #stage_close {
          width: 120px;
          height: 40px;
          margin-right: var(--main_gap);
          border: 1px solid #FFFFFF;
          box-shadow: 0 0 2px 2px #FFFFFF;
        }
        @media screen and (max-width: 768px) {
          #stage_controls {
            height: 40px;
          }
          #stage_min,
          #stage_max,
          #stage_close {
            width: 60px;
            height: 20px;
            font-size: 12px;
          }
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
    `;
        this.shadow.appendChild(template.content.cloneNode(true));
        this.dom.stage_mask = this.shadow.querySelector('#stage_mask');
        this.dom.stage = this.shadow.querySelector('#stage');
        this.dom.stage_min = this.shadow.querySelector('#stage_min');
        this.dom.stage_close = this.shadow.querySelector('#stage_close');
        this.dom.stage_application_container = this.shadow.querySelector('#stage_application_container');
        this.dom.stage_min.addEventListener('click', () => {
            this.doMinimize.call(this);
        });
        this.dom.stage_close.addEventListener('click', () => {
            this.doClose.call(this);
        });
    }
    showApplication(application) {
        this.current_application = application;
        this.dom.stage_mask.classList.remove('scale-0');
        this.dom.stage.classList.remove('scale-0');
        this.dom.stage.classList.add('scale-1');
        this.current_application_dom = this.application_dom_list.find((item) => item.id === application.id);
        if (this.current_application_dom) {
            this.dom.stage_application_container.append(this.current_application_dom); // 创建或放到最后一个位置
        }
        else {
            if (application.js_url) {
                this.current_application_dom = document.createElement(application.id);
            }
            else {
                this.current_application_dom = new OnceChatHTMLElement(application);
            }
            this.current_application_dom.id = application.id;
            this.dom.stage_application_container.append(this.current_application_dom);
            this.application_dom_list.push(this.current_application_dom);
            app.eventHandler('task-control', 'createApplication', this.current_application, this);
        }
        // 当前显示处理
        this.application_dom_list.forEach((i) => {
            i.classList.add('none');
        });
        this.current_application_dom.classList.remove('none');
    }
    doMinimize() {
        this.dom.stage_mask.classList.add('scale-0');
        this.dom.stage.classList.remove('scale-1');
        this.dom.stage.classList.add('scale-0');
        app.eventHandler('task-control', 'highlightApplication', this.current_application, this);
    }
    doClose() {
        this.doMinimize();
        this.current_application_dom.remove();
        this.application_dom_list.splice(this.application_dom_list.indexOf(this.current_application_dom), 1);
        app.eventHandler('task-control', 'deleteApplication', this.current_application, this);
    }
}
window.customElements.define('application-stage', ApplicationStage);
