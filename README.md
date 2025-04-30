# Doku Payment Integration

This repository provides a Node.js TypeScript-based service for integrating with the **Doku Payment** gateway. It allows businesses to create payments via Doku's Virtual Account (VA) system, handle payment notifications, and validate payment callbacks through secure signature verification. This example demonstrates how to set up the integration with Doku's API, handle payment requests, and process callbacks in a **sandbox** environment using **Bun** as the runtime.

## 🚀 Overview

The project focuses on integrating the Doku Payment gateway for:

- **Creating a Virtual Account Payment**: Allows customers to initiate a payment by providing their information and order details.
- **Handling Payment Callback**: After the customer completes the payment, Doku sends a callback to notify the system of the payment status. This project includes logic to verify the callback signature and process the response.
- **Secure Signature Generation and Verification**: Doku uses HMAC-SHA256 signatures to secure API requests and callbacks. The project demonstrates how to generate and verify these signatures.

## 🛠 Key Features

- **Payment Request Creation**: Use the Doku API to create payment requests with customer and order details.
- **Callback Handling**: Securely handle Doku's payment status callback using signature verification.
- **Flexible Configuration**: Configure the system to work with Doku's production or sandbox environment via environment variables.

---

To install dependencies:

```bash
bun install
```

To run:

```bash
bun src/index.ts
```

This project was created using `bun init` in bun v1.1.30. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
