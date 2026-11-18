import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    default: "FreshCart",
    template: "%s | FreshCart",
  },
  description: "Farm-fresh grocery delivery powered by Route Academy E-commerce API.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}