import { Payment } from "./events/payment.js"
import { Marketing } from "./observers/marketing.js"
import { Shipment } from "./observers/shipment.js"
import { SomeShit } from "./observers/some-shit.js"
import { PaymentSubject } from "./subjects/payment-subject.js"

const subject = new PaymentSubject()

const marketing = new Marketing()
const shipment = new Shipment()
const shit = new SomeShit()

subject.subscribe(marketing)
subject.subscribe(shipment)
subject.subscribe(shit)

const payment = new Payment(subject)

payment.creditCard({ id: "id", userName: "@somename", description: "some discription" })
