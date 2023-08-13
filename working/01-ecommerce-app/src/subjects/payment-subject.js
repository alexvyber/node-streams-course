export class PaymentSubject {
  #observers = new Set()

  notify(data) {
    this.#observers.forEach((observer) => observer.update(data))
  }

  unsubscribe(observavle) {
    this.#observers.delete(observavle)
  }

  subscribe(observavle) {
    this.#observers.add(observavle)
  }
}
