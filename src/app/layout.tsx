import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter, JetBrains_Mono, Archivo_Black } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "~/components/site/header";
import { Footer } from "~/components/site/footer";
import { ThemeProvider } from "~/components/site/theme-provider";
import { RevealObserver } from "~/components/primitives/reveal-observer";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Ripon Uno League",
    template: "%s · RUL",
  },
  description:
    "Ripon High's official UNO club. Leaderboards, monthly prizes, and chaos Monday–Thursday, 5–8 PM.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${inter.variable} ${jetbrainsMono.variable} ${archivoBlack.variable}`}
      >
        <body className="bg-background text-foreground min-h-screen font-sans antialiased">
          <ThemeProvider>
            <RevealObserver />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
