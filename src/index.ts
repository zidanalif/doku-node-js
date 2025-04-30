import { DokuPaymentService } from "./services/DokuPaymentService";

const result = await DokuPaymentService.createPayment({
  customer: {
    name: "Budi",
    last_name: "Santoso",
    email: "budi@example.com",
    phone: "08123456789",
  },
  order: {
    amount: 150000,
    invoice_number: "INV-20250430-01",
    callback_url: "https://yourdomain.com/redirect",
  },
  additional_info: {
    override_notification_url: "https://yourdomain.com/doku/callback",
  },
});

console.log(result.data);
