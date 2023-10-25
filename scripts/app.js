let app = new class App {
  constructor() {
    this.installApplication()
  }

  installApplication() {
    window.application_list.forEach(application => {
      this.eventHandler('application-list', 'addApplication', application, this )
    })
  }

  eventHandler(target_query, event, data, dispatcher) {
    let target = document.querySelector(target_query)
    let handler = target && target[event]
    handler && handler.call(target, data)
    console.log({ dispatcher })
  }
}