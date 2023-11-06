class EffectionAnalysisWC extends BaseOnceChatHTMLElement {
  constructor() {
    super()
    console.log('情感分析 web component 被创建了')
    this.params = {
      placeholder: '这里输入需要检测的文本信息，如商品评论等',
      pre_content: '请基于以下内容，帮我分析其中信息包含的情感：【',
      tail_content: '】。\n请告诉这段话是中性、积极、还是消极，并给出理由。其他要求：1、格式化输出，格式为"结果：xxx\n原因：xxx"；2、不用给出其他建议，只给结果即可。',
    }
  }
}

window.customElements.define('effection-analysis', EffectionAnalysisWC)