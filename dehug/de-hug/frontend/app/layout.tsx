import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThirdwebProvider } from "thirdweb/react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DeHug - The Decentralized Hugging Face",
  description: "A decentralized, open platform for hosting, sharing, and accessing machine learning models and datasets. Built on Filecoin/IPFS for permanent, censorship-resistant storage.",
  keywords: "machine learning, AI models, datasets, decentralized, IPFS, Filecoin, Hugging Face, open source, ML",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThirdwebProvider>
          <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col bg-black text-white">
            <Header />
            <main className="flex-1 pt-16 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">{children}</main>
            <Footer />
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastClassName="bg-gray-800 text-white border border-gray-700"
            progressClassName="bg-orange-500"
          />
        </ThemeProvider>
        </ThirdwebProvider>
      </body>
    </html>
  )
}
