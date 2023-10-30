window.chat = new class Caht {
  constructor() {
    this.is_generatting = false
    this.sse_url = 'https://api.kvker.com/api/sse/chat/open'
  }

  sse(text, callback) {
    if(this.is_generatting) {
      alert('正在生成中...')
      return
    }
    fetch(this.sse_url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        "messages": [{ "role": "user", "content": text }],
        context: '',
      }),
    }).then(response => {
      const reader = response.body.getReader()
      let text = ''
      let json = {}
      let result_text = ''

      let process = ({ done, value }) => {
        if(done) {
          // console.log(result_text)
          console.log('Stream closed')
          callback(null, done)
          return
        }

        text = new TextDecoder('utf-8').decode(value)
        // console.log(text)

        let kvs = text.split('\n')
        // console.log(kvs)
        kvs.forEach(kv => {
          // console.log(kv)
          let [key, value] = kv.split(':')
          if(key) {
            json[key] = value
            if(key === 'data') {
              if(!value) {
                value = '\n'
              }
              result_text += value
              callback(value, false)
            }
            if(key === 'event' && value === 'finish') {
              this.is_generatting = false
            }
          }
        })
        // console.log(json.data)

        return reader.read().then(process)
      }
      reader.read().then(process)
    })
      .catch(error => {
        this.is_generatting = false
        console.log('error', error)
      })
  }
}