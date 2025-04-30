import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { DOKU_CONFIG, generateSignature, getRequestDate } from "../lib/doku";

export interface CreatePaymentPayload {
  customer: {
    name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  order: {
    amount: number;
    invoice_number: string;
    callback_url?: string;
  };
  payment?: {
    payment_due_date?: number; // dalam menit
  };
  additional_info?: {
    override_notification_url?: string; // Override notification URL di Doku (Callback URL)
  };
}

export class DokuPaymentService {
  private static getHeaders(
    path: string,
    body: object,
    requestId: string,
    requestDate: string
  ) {
    const signature = generateSignature(path, body, requestId, requestDate);

    return {
      "Content-Type": "application/json",
      "Client-Id": DOKU_CONFIG.CLIENT_ID,
      "Request-Id": requestId,
      "Request-Timestamp": requestDate,
      Signature: `HMACSHA256=${signature}`,
    };
  }

  static async createPayment(params: CreatePaymentPayload) {
    const path = "/checkout/v1/payment";
    const url = `${DOKU_CONFIG.BASE_URL}${path}`;
    const requestId = uuidv4();
    const requestDate = getRequestDate();

    const payload = {
      customer: params.customer,
      order: params.order,
      payment: {
        payment_due_date: params.payment?.payment_due_date || 60,
      },
      additional_info: params.additional_info || {},
    };

    const headers = this.getHeaders(path, payload, requestId, requestDate);

    try {
      const response = await axios.post(url, payload, { headers });

      return response;
    } catch (error: any) {
      console.error(
        "Doku Payment Error:",
        error?.response?.data || error.message
      );
      throw new Error("Failed to create payment");
    }
  }
}
