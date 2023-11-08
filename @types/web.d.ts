declare const lc: any
declare const md5: any
declare const Swiper: any
declare const ui: UI
declare const util: Util
declare const markdownit: any


interface Window {
  [key: string]: any
}

interface HTMLObject {
  [key: string]: HTMLElement
}

interface BaseComponent {
  data: BaseObject & {
    user: LCUser,
  },
  dom: HTMLObject,
  init?(): void,
  cache?: BaseObject,
}