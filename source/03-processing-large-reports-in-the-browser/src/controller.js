export default class Controller {
  #view
  #service
  #worker
  #events = {
    alive() { },
    progress: ({ total }) => {
      this.#view.updateProgress(total)
    },
    ocurrenceUpdate: ({ found, took, lineCounter }) => {
      const [[key, value]] = Object.entries(found)
      this.#view.updateReport(
        `found ${value} ocurrences of ${key} - over ${lineCounter} lines - took: ${took}`
      )
    }
  }
  constructor({ view, service, worker }) {
    this.#view = view
    this.#service = service
    this.#worker = this.#configureWorker(worker)
  }

  static init(deps) {
    const controller = new Controller(deps)
    controller.init()
    return controller
  }
  init() {
    this.#view.configureOnFileChange(
      this.#configureOnFileChange.bind(this)
    )

    this.#view.configureOnSubmit(
      this.#configureOnSubmit.bind(this)
    )
  }
  #configureWorker(worker) {
    worker.onmessage = (({ data }) => this.#events[data.eventType](data))
    return worker
  }

  #formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let i = 0
    for (i; bytes >= 1024 && i < 4; i++) {
      bytes /= 1024
    }

    return `${bytes.toFixed(2)} ${units[i]}`
  }

  #configureOnFileChange(file) {
    this.#view.setFileSize(
      this.#formatBytes(file.size)
    )
  }

  #configureOnSubmit({ description, file }) {
    const query = {}
    query['call description'] = new RegExp(
      description, 'i'
    )
    // HOLD | hold | hOlD
    if (this.#view.isWorkerEnabled()) {
      console.log('executing on worker thread!')
      this.#worker.postMessage({ file, query })
      return
    }
    console.log('executing on main thread!')
    this.#service.processFile({
      query,
      file,
      onProgress: (total) => {
        this.#events.progress({ total })
      },
      onOcurrenceUpdate: (...args) => {
        this.#events.ocurrenceUpdate(...args)
      }
    })
  }
}
