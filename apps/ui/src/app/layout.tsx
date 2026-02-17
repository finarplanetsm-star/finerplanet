import { Geist, Geist_Mono } from "next/font/google"

import type { Metadata } from "next"

import "./globals.css"

import Footer from "@/_components/Footer"
import Header from "@/_components/Header"
import Navbar from "@/_components/Navbar"
// import { ArticleSearchProvider } from "@/context/articleContext"
import { BlogProvider } from "@/context/blogContext"

import Hero_Section from "../_components/Hero_Section"
import { NavProvider } from "../context/NavContext"

// import { FormSearchProvider } from "@/context/FormSearchContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "UT Dallas",
  description: "Best Business Research for academics and students alike",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BlogProvider>
          <NavProvider>
            <Header />
            {children}
            <Footer />
          </NavProvider>
        </BlogProvider>
      </body>
    </html>
  )
}
