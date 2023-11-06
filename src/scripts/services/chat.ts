window.chat = new class Chat {
  sse_url: string
  chat_box: HTMLElement
  status: BaseObject

  constructor() {
    this.sse_url = 'https://api.kvker.com/api/sse/chat/open'
    this.chat_box = document.querySelector('chat-box') as HTMLElement
    this.status = {
      is_sending: false,
    }
  }

  /**
   * 支持单独船文字或文字的数组
   * @param {string | string[]} message 传入的文字信息
   * @param {*} callback 每次sse触发的回调
   * @returns
   */
  sse(text_list: string[], callback: Function, error_cb?: Function) {
    if (!text_list || !text_list.length) return
    if (this.status.is_sending) {
      error_cb && error_cb(new Error('正在请求中...'))
      return
    }
    this.status.is_sending = true
    let messages = text_list.map((text, index) => {
      if (index % 2) {
        return { role: "assistant", content: text }
      } else {
        return { role: "user", content: text }
      }
    })
    let is_first = true
    fetch(this.sse_url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        messages,
      }),
    }).then(response => {
      if (response.body) {
        const reader = response.body.getReader()
        let text = ''
        let json: BaseObject = {}
        let result_text = ''

        let process: Function = (ret: { done: boolean, value: ArrayBuffer }) => {
          let { done, value } = ret
          if (done) {
            // console.log(result_text)
            console.log('Stream closed')
            callback('', done)
            return
          }

          text = new TextDecoder('utf-8').decode(value)
          // console.log(text)

          let kvs = text.split('\n')
          // console.log(kvs)
          kvs.forEach(kv => {
            // console.log(kv)
            let [key, value] = kv.split(':')
            if (key) {
              json[key] = value
              if (key === 'data') {
                if (!value) {
                  value = '\n'
                }
                result_text += value
                callback(value, false, is_first)
                is_first = false
              }
              if (key === 'event' && value === 'finish') {
                this.status.is_sending = false
              }
            }
          })
          // console.log(json.data)

          return reader.read().then((ret) => process(ret))
        }
        reader.read().then((ret) => process(ret))
      } else {
        alert('请求SSE错误')
      }
    })
      .catch(error => {
        this.status.is_sending = false
        console.log('error', error)
      })
  }
}