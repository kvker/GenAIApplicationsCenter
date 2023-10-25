class ChatBox extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    const template = document.createElement('template')
    template.innerHTML = `
      <link rel="stylesheet" href="styles/variable.css">
      <link rel="stylesheet" href="styles/main.css">
      <style>
        :host {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 588px;
        }

        .p-main {
          padding:var(--main_gap);
        }

        .container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          background-color:#fff;
        }

        .chat-container {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 20px;
        }

        .input-container {
          height: 80px;
          min-height: 80px;
          background: #F0F2FF;
          border-radius:4px;
        }

        .chat-input {
          width:100%;
          height:100%;
          overflow:auto;
          border:none;
          background: #F0F2FF;
        }

        .chat-input::placeholder {
            color: var(--color_gray_3);
        }

        .chat-input:focus,
        .chat-input:hover {
          border:none;
        }

        .chat-ask-item,
        .chat-answer-item {
          display:flex;
          margin-bottom:var(--main_gap);
        }

        .chat-ask-item {
          justify-content: flex-end;
        }

        .avatar {
          width:40px;
          height:40px;
        }

        .chat-answer-item .avatar {
          margin-right:8px;
        }

        .chat-ask-item .avatar {
          margin-left:26px;
        }

        .content-box{
          max-width:calc(100% - 114px);
        }

        .chat-content {
          white-space: pre-line;
          border-radius:8px;
          width:auto;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          letter-spacing: 0em;
          text-align: left;
        }

        .chat-answer-item .chat-content{
          background-color:#F0F2FF;
          color:#333;
          border-top-left-radius: 1px;
        }

        .chat-ask-item .chat-content{
          background-color: #8699FF;
          color:#fff;
          border-top-right-radius: 1px;
        }
      </style>
      <div class="container">
        <div class="chat-container">
          <div class="chat-last-item"></div>
        </div>
        <div class="input-container p-main">
          <textarea class="chat-input" placeholder="在这里输入问题..." disabled="true" type="text"></textarea>
        </div>
      </div>
    `
    this.shadow.appendChild(template.content.cloneNode(true))
    this.chat_box = this.shadow.querySelector('.chat-container')
    this.chat_last_item = this.shadow.querySelector('.chat-last-item')
    this.input_dom = this.shadow.querySelector('.chat-input')
    this.chat_box.addEventListener('scroll', this.handleScroll.bind(this))
    this.input_dom.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
        this.input_dom.value += '\n'
      }
      else if(e.key === 'Enter') {
        // 取消默认换行
        e.preventDefault()
        this.inputValue()
      }
    })

    this.init()
  }

  init(hello_word = '你好, 现在可以开始问我相关问题啦.') {
    this.input_dom.disabled = false
    this.updateAnswer(hello_word, true)
  }

  updateAnswer(text, done = false, idx) {
    // 已完结就开一个新的,未完结就在最后一个插入
    if(done) {
      let html = `
        <div class="chat-answer-item">
          <img class="avatar" src="icons/default-answer-avatar.png">
          <div class="content-box">
            <pre class="chat-content p-main">${text}</pre>
          </div>
        </div>
      `
      this.chat_last_item.insertAdjacentHTML('beforebegin', html)
    }
    else {
      let last_answer_dom_list = this.shadow.querySelectorAll('.chat-answer-item .chat-content')
      let last_dom = last_answer_dom_list[idx ? idx : last_answer_dom_list.length - 1]
      last_dom.textContent = last_dom.textContent + text
    }
  }

  scrollToBottom() {
    this.chat_box.scrollBy(0, 10000)
  }

  handleScroll(event) {
    // 在这里处理滚动事件
    // console.log('Scrolling:', this.chat_box.scrollTop)
  }

  inputValue() {
    if(!this.input_dom.value) return
    // 处理输入
    let value = this.input_dom.value
    let html = `
    <div class="chat-ask-item">
      <div class="content-box">
        <div class="chat-content p-main">${this.input_dom.value}</div>
      </div>
      <img class="avatar" src="icons/default-user-avatar.png">
    </div>`
    this.chat_last_item.insertAdjacentHTML('beforebegin', html)
    this.chat_last_item.scrollIntoView({ behavior: 'smooth' })
    this.dispatchCustomEvent('confirm', value)
    this.input_dom.value = ''
    this.requestChat(value)
  }

  cancelSend() {
    let children = this.chat_box.children
    let chat_box_last2_child = children[children.length - 2]
    if(chat_box_last2_child.classList.contains('chat-ask-item')) {
      chat_box_last2_child.remove()
    }
  }

  requestChat(text) {
    chat.sse(text, (value, done) => {
      this.updateAnswer(value, done)
      if(done) {
        this.updateAnswer('')
        this.scrollToBottom()
      }
    })
  }

  dispatchCustomEvent(event_name, value) {
    // 创建自定义事件
    let customEvent
    switch(event_name) {
      default:
        customEvent = new CustomEvent(event_name, {
          detail: value,
        })
        break
    }
    // 触发自定义事件
    this.dispatchEvent(customEvent)
  }
}

customElements.define('chat-box', ChatBox)
// 示例代码
// let html = `
// <div class="flex service-detail-area" style="height:466px">
//   <div style="width:380px;height:100%;margin-right:16px;background-color: #fff;"></div>
//   <div class="f1 h-100">
//     <ks-chat-box></ks-chat-box>
//   </div>
// </div>
// `
// document.querySelector('main')?.insertAdjacentHTML('beforeend', html)
// let chat_box = document.querySelector('ks-chat-box') as ChatBox
// // init之后 输入框可用
// chat_box.init('你好,我是你的专属客服,你可以开始问我文档中的相关问题啦')
// chat_box.addEventListener('confirm', async (event) => {
//   let value = (event as CustomEvent).detail
//   console.log(value)
//   // 获取结果
//   let answer_list = ['你好,', 'asdf', 'asdfad']
//   let idx = 0
//   for (let answer of answer_list) {
//     chat_box.updateAnswer(answer, idx === 0)
//     idx++
//     await new Promise(resolve => setTimeout(resolve, 500))
//   }
// })
