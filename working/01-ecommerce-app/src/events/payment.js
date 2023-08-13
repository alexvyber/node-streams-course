export class Payment {
  constructor(paymenySubject) {
    this.paymentSubject = paymenySubject // this.paymentSubject
  }

  creditCard(paymentData) {
    console.log(`
    payment recieved from ${paymentData.description}`)
    this.paymentSubject.notify(paymentData)
  }
}
