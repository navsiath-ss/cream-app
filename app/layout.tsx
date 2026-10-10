import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'CREAM | Premier AI-Native Creator Marketplace',
  description:
    'The premier AI-native creator marketplace featuring conversational brief building, deterministic creator discovery, Live AI witness negotiations, Razorpay upfront escrow vaults, and dual-layer SynthID watermarking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Razorpay Standard Checkout SDK */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="bg-[#0b0d13] text-zinc-100 min-h-screen flex flex-col font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
        <footer className="border-t border-zinc-800/80 bg-[#090b10] py-8 text-center text-xs text-zinc-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-300 font-mono">CREAM AI</span>
              <span>— The Cream Layer of Generative Talent</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <span>DigiLocker Zero-Storage KYC</span>
              <span>•</span>
              <span>Razorpay Escrow Vault</span>
              <span>•</span>
              <span>SynthID Dual Watermark</span>
              <span>•</span>
              <span>Live AI Witness</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
