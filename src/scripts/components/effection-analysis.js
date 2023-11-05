class EffectionAnalysisWC extends BaseHTMLElement {
  constructor() {
    super()
    console.log('情感分析 web component 被创建了')
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
          padding: 20px
        }

        #effection_analysis_container .effection-analysis-textarea {
          width: 100%;
          height: 120px;
          padding: 20px;
        }

        #effection_analysis_container .result {
          background: white;
          max-height: 340px;
          padding: 20px;
        }
      </style>
      <div id="effection_analysis_container" class="flex-c h-100">
       <textarea class="effection-analysis-textarea" placeholder="这里输入需要检测的文本信息，如商品评论等"></textarea>
       <button class="submit-button button-primary my-20">检测</button>

       <div class="flex-c">
        <pre class="result none scroll-y"></pre>
       </div>
      </div>
    `
    this.shadow.appendChild(template.content.cloneNode(true))

    this.dom.textarea = this.shadowRoot.querySelector('textarea')
    this.dom.result = this.shadowRoot.querySelector('.result')
    this.dom.submit_button = this.shadowRoot.querySelector('.submit-button')

    this.dom.submit_button.addEventListener('click', e => {
      this.doSubmit()
    })
  }

  doSubmit() {
    let text = this.getText()
    if(!text) return
    text = `请基于以下内容，帮我分析其中信息包含的情感：【${text}】。\n请告诉这段话是中性、积极、还是消极，并给出理由。其他要求：1、格式化输出，格式为"结果：xxx\n原因：xxx"；2、不用给出其他建议，只给结果即可。`
    this.dom.result.classList.remove('none')
    this.dom.result.innerText = ''
    this.requestResult(text)
  }

  requestResult(text) {
    chat.sse([text], (value, done) => {
      if(done) {
        this.scrollToBottom()
      } else {
        this.updateAnswer(value, done)
      }
    }, error => {
      console.log(error.message || error)
      // alert(error.message || error)
    })
  }

  scrollToBottom() {
    this.dom.result.scrollBy(0, 10000)
  }

  updateAnswer(value) {
    this.dom.result.innerText += value
  }

  getText() {
    return this.dom.textarea.value.trim()
  }
}

window.customElements.define('effection-analysis', EffectionAnalysisWC)