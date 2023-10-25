let app = new class App {
  constructor() {

  }

  eventHandler(target_query, event, data, dispatcher) {
    let target = document.querySelector(target_query)
    let handler = target && target[event]
    handler && handler.call(target, data)
    console.log({ dispatcher })
  }
}