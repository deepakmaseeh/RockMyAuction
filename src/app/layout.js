import { Geist, Geist_Mono } from "next/font/google";
import { RoleProvider } from '../contexts/RoleContext';
import FloatingChatbot from '@/components/FloatingChatbot';
import { WishlistProvider } from '../contexts/WishlistContext';
import FormIntegrationSetup from '@/components/FormIntegrationSetup';

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Rock the Auction - Multi-user Auction Platform',
  description: 'Buy and sell unique items in live auctions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090B] text-white`}>
        <RoleProvider>
          <WishlistProvider>
            <FormIntegrationSetup />
            {children}
            <FloatingChatbot /> {/* ✅ Appears on all pages */}
          </WishlistProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
