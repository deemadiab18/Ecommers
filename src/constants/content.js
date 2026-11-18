import { STORE } from "./store";

export const SITE_PAGES = {
  "/contact": {
    title: "Contact us",
    intro: "Questions about an order, delivery, or your account? We are here to help.",
    sections: [
      {
        heading: "Reach us",
        body: [
          `Phone: ${STORE.phone}`,
          `Email: ${STORE.email}`,
          `Service area: ${STORE.city}`,
        ],
      },
      {
        heading: "Hours",
        body: ["Customer support is available daily, 9:00–21:00 Cairo time."],
      },
    ],
  },
  "/faqs": {
    title: "FAQs",
    intro: "Quick answers to common questions about shopping with FreshCart.",
    sections: [
      {
        heading: "Delivery",
        body: [
          `Free shipping applies to orders over ${STORE.freeShipping} EGP within our service area.`,
          "Delivery windows are confirmed by SMS after your order is placed.",
        ],
      },
      {
        heading: "Returns",
        body: [
          "Unopened groceries can be returned within 48 hours of delivery where local regulations allow.",
          "Contact support with your order number to start a return.",
        ],
      },
      {
        heading: "Payments",
        body: [
          "We accept cash on delivery and secure online payment (card) at checkout.",
          "Online payments are processed through Stripe; you will return to FreshCart after payment.",
        ],
      },
    ],
  },
  "/shipping": {
    title: "Shipping & returns",
    intro: "How we deliver and how returns work.",
    sections: [
      {
        heading: "Shipping",
        body: [
          `Orders above ${STORE.freeShipping} EGP qualify for free standard delivery.`,
          "Standard delivery is typically 1–3 business days in Greater Cairo.",
          "You will receive tracking updates by SMS once the order ships.",
        ],
      },
      {
        heading: "Returns",
        body: [
          "Report damaged or incorrect items within 24 hours of delivery.",
          "Refunds for eligible returns are issued to the original payment method or as store credit.",
        ],
      },
    ],
  },
  "/privacy": {
    title: "Privacy policy",
    intro: "How FreshCart handles your personal information.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Account details (name, email, phone) when you register or update your profile.",
          "Order and delivery information needed to fulfil purchases.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "To process orders, communicate about delivery, and improve our service.",
          "We do not sell your personal data to third parties.",
        ],
      },
      {
        heading: "Your choices",
        body: ["You can update profile details in your account or contact us to request data deletion, subject to legal retention requirements."],
      },
    ],
  },
  "/terms": {
    title: "Terms of service",
    intro: "By using FreshCart you agree to these terms.",
    sections: [
      {
        heading: "Orders",
        body: [
          "Placing an order constitutes an offer to buy. We confirm acceptance when the order is dispatched.",
          "Prices and availability may change until checkout is complete.",
        ],
      },
      {
        heading: "Accounts",
        body: [
          "You are responsible for keeping your login credentials secure.",
          "You must provide accurate delivery and contact information.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "FreshCart is provided as-is for grocery shopping in Egypt. Our liability is limited to the extent permitted by applicable law.",
        ],
      },
    ],
  },
};