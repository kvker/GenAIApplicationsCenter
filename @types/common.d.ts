declare const localforage: any
declare const $: any
declare const VConsole: any
declare const Hammer: any
declare const rule: Rule
declare const chat: Chat
declare const dayjs: any

type base64 = string

interface BaseObject {
  [key: string]: any
}

interface Application {
  name: string,
  tag: string,
  js_url: string,
  id: string,
}


interface Element {
  [key: string]: any
}

interface Function {
  before(fn: any): void,
  after(fn: any): void,
}

interface URLLibResponse {
  data: Buffer
}

interface LCRequest {
  params: any,
  currentUser: any,
  expressReq: any,
  params: any,
  object: any,
  meta: any,
  user: any,
  currentUser: any,
  sessionToken,
}

interface LCResponse {
  code: number,
  msg: string,
  data: any,
  error?: any,
}

interface LCObject {
  id: string,
  get(id: string): any,
  set(key: string, any): any,
  add(key: string, any): any,
  save(option?: any): Promise<any>,
  destroy(): Promise<any>,
  toJSON(): Object,
}

interface LCAuthData {
  uid?: string
  openid: string
}

interface LCUser extends LCObject {
  isAnonymous(): boolean
  associateWithAuthData(authData: LCAuthData, platform: string): promise<LCUser | Error>
  getSessionToken(): string
}

interface LCError extends Error {
  rawMessage: string,
}

interface LCQuery {
  notEqualTo(field: string, value: any): void
  limit(num: number): void,
  skip(num: number): void,
  equalTo(field: string, value: any): void,
  greaterThan(field: string, value: any): void
  lessThan(field: string, value: any): void
  descending(field: string): void,
  ascending(field: string): void,
  include(field: string): void
  notContainedIn(field: string, value: any): void
  addDescending(field: string): void
  notContainedIn(field: string, array: string[]): void
}

interface LCRuleResponse {
  code: number,
  msg: string,
  error?: Error | string,
  data?: Object | string
}


interface integrationItem {
  temp_integration?: number,
  integration: number,
  action_id: string,
  error_action_id: string,
  error_msg?: string
}
interface Rule {
  is_dev: boolean,
  warning_string: string,
  is_stage: boolean,
  bj_api_address: url,
  headers: {
    'X-LC-Id': string | undefined
    'X-LC-Key': string | undefined
  },
  default_urllib_options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH',
    headers: BaseObject,
    dataType: string,
    timeout: number,
  } & BaseObject,
  KS_WRITE_NEED_INTEGRATION: { [key: string]: number },
  retHandler: (ret: URLLibResponse, key?: string) => any,
  openAIMsgSafeHandle: (text: string) => string,
  replaceWarnString: (str: string) => string,
  log: (msg: string) => void,
  success: (data: any, code: number = 200, msg: string = 'success') => {
    code,
    msg,
    data,
  },
  fail: (error, code?: number = 0, msg: string = 'error') => {
    code,
    msg,
    error,
  },
  error: (error) => Promise<string>,
  sleep: (ms?: number = 5000) => Promise<void>,
  checkUserAgent(req: LCRequest): string,
  customCheckContent(text: string): Promise<{ suggestion: string }>,
  checkContent({ text: string }): Promise<{ suggestion: string }>,
  blockText(check_result: string): string,
  blockImage(check_result: string): string,
  toCamelCase(str: string): string,
  toConstantCase(str: string): string,
  checkUserIntegration({ user = {} as LCUser, func_name = '' as string, func_key = 'common' as string, extra_integration = 0 as number, application_id = '' as string }): Promise<boolean | integrationItem>,
  handleFuncIntegration({ user = {} as LCUser, temp_integration = 0 as number, integration = 0 as number, action_id = '' as string, error_action_id = '' as string, remind = '' as string, func_name = '' as string } = {}, reduce_type: boolean = true): Promise<>,
  checkAnnoymous(user: LCUser, action_type: string, cost: number = 1): Promise<boolean>,
  handleAnnoymous(user: LCUser, action_type: string, add: number = 1): Promise<boolean>,
  handleFuncHistory(func_name: string, key?: string): void
  getImageSize(url: string): Promise<{ width: number, height: number }>
}