"use strict";
class OnceChatHTMLElement extends BaseHTMLElement {
    constructor(params) {
        super();
        this.params = params;
        this.application = this.params;
        this.setAttribute('id', this.params.id);
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
          display: block;
          width: 100%;
          height: 100%;
          padding: 20px
        }

        #${this.params.id + '_container'} .base-once-chat-textarea {
          width: 100%;
          height: 120px;
          padding: 20px;
        }

        #${this.params.id + '_container'} .result {
          background: white;
          max-height: 340px;
          padding: 20px;
        }
        .submit-button {
          display: none;
        }
        @media screen and (max-width: 768px) {
          .submit-button {
            display: block;
          }
        }
      </style>
      <div id="${this.params.id + '_container'}" class="flex-c h-100">
       <textarea class="base-once-chat-textarea mb-20" placeholder="${this.params.placeholder}\nShift+Enter发送"></textarea>
      <button class="submit-button button-primary mb-20">提交</button>
       <div class="flex-c">
        <pre class="result none scroll-y"></pre>
       </div>
      </div>
    `;
        this.shadow.appendChild(template.content.cloneNode(true));
        const shadow_root = this.shadowRoot;
        this.dom.textarea = shadow_root.querySelector('textarea');
        this.dom.result = shadow_root.querySelector('.result');
        this.dom.submit_button = shadow_root.querySelector('.submit-button');
        this.dom.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.shiftKey) {
                // 取消默认换行
                e.preventDefault();
                this.doSubmit();
            }
            else if (e.key === 'Enter') {
                e.preventDefault();
                this.dom.textarea.value += '\n';
            }
        });
    }
    doSubmit() {
        let text = this.getText();
        if (!text)
            return;
        text = this.concatContent(text);
        this.dom.result.classList.remove('none');
        this.dom.result.innerText = '';
        this.requestResult(text);
    }
    concatContent(text) {
        let content = `${this.params.pre_content} 如下：【${text}】\n注意要求：\n${this.params.tail_content}`;
        return content;
    }
    requestResult(text) {
        chat.sse([text], (value, done) => {
            if (done) {
                this.scrollToBottom();
            }
            else {
                this.updateAnswer(value, done);
            }
        }, (error) => {
            console.log(error.message || error);
            // alert(error.message || error)
        });
    }
    scrollToBottom() {
        this.dom.result.scrollBy(0, 10000);
    }
    updateAnswer(value, done) {
        this.dom.result.innerText += value;
    }
    getText() {
        return this.dom.textarea.value.trim();
    }
}
window.customElements.define('once-chat', OnceChatHTMLElement);
