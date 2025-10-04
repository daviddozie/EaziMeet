import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "EaziMeet",
  description:
    "EaziMeet offers a streamlined platform for spontaneous meetings and collaborative sessions. Start or join a meeting with a single click, no downloads or sign-ups required.",
};

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} bg-[#0C192C] antialiased`}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
