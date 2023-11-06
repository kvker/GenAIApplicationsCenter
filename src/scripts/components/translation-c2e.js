class TranslationC2EWC extends BaseOnceChatHTMLElement {
  constructor() {
    super()
    console.log('中译英 web component 被创建了')
    this.params = {
      placeholder: '请输入需要翻译的中文',
      button_label: '翻译',
      pre_content: '请将下面一段中文翻译成英语：【',
      tail_content: '】。\n要求：1、使用英伦口吻。',
    }
  }
}

window.customElements.define('translation-c2e', TranslationC2EWC)