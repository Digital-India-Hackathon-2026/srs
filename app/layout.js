import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import FloatingBot from "../components/assistant/FloatingBot";

export const metadata = {
  title: "SevaSetu Telangana – Public Service Navigator",
  description: "AI-powered multilingual guide for Telangana government services.",
  icons: { icon: [{ url: "/favicon.png", type: "image/png" }], apple: "/favicon.png" },
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#f4f6f8] text-[#1a2733]">
        <LanguageProvider>
          {children}
          <FloatingBot />
        </LanguageProvider>
      </body>
    </html>
  );
}
