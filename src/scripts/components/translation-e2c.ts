class TranslationE2CWC extends BaseOnceChatHTMLElement {
  constructor() {
    super()
    console.log('英译中 web component 被创建了')
    this.params = {
      placeholder: '请输入需要翻译的英语',
      pre_content: '请将下面一段英语翻译成中文：【',
      tail_content: '】。\n要求：1、信达雅；2、只需要翻译，不要解释为什么这样翻译。',
    }
  }
}

window.customElements.define('translation-e2c', TranslationE2CWC)