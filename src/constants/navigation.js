export const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All products", to: "/products" },
      { label: "Categories", to: "/categories" },
      { label: "Brands", to: "/brands" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My profile", to: "/profile", protected: true },
      { label: "My orders", to: "/allorders", protected: true },
      { label: "Wishlist", to: "/wishlist", protected: true },
      { label: "Cart", to: "/cart", protected: true },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact us", to: "/contact" },
      { label: "FAQs", to: "/faqs" },
      { label: "Shipping & returns", to: "/shipping" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", to: "/privacy" },
      { label: "Terms of service", to: "/terms" },
    ],
  },
];