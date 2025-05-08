import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono, Tektur } from "next/font/google";
import "./globals.scss";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/header";
import { SideBar } from "@/components/sidebar";
import { Toaster } from 'react-hot-toast';
import { currentUser } from "@clerk/nextjs/server";
import { LoginCard } from "@/components/loginCard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tektur = Tektur({
  variable: "--font-tektur",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://convexa.vercel.app'),
  title: {
    default: 'Convexa | Conecte-se de forma autêntica',
    template: '%s | Convexa',
  },
  description: 'Convexa é uma plataforma moderna para conectar pessoas, compartilhar ideias e ampliar redes de forma divertida e profissional.',
  icons: {
    icon: '/favicon.svg',
  },
  keywords: [
    'rede social',
    'conexões',
    'comunidade',
    'networking',
    'Convexa',
  ],
  authors: [
    { name: 'Luciano Mathias', url: 'https://www.linkedin.com/in/lucianomathiasamorim/' }
  ],
  creator: 'Convexa',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Convexa | Plataforma de Conexões',
    description: 'Junte-se à Convexa para compartilhar ideias, criar relacionamentos e descobrir novas oportunidades.',
    url: 'https://convexa.vercel.app/',
    siteName: 'Convexa',
    images: [
      {
        url: '/convexaLogo.png',
        width: 1200,
        height: 630,
        alt: 'Convexa logo e conexões',
      },
    ],
    locale: 'pt-BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convexa | Conexões autênticas',
    description: 'Descubra a Convexa: onde ideias se encontram e oportunidades se conectam.',
    creator: '@SeuHandleNoTwitter',
    images: ['/convexaLogo.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  return (
    <ClerkProvider>
      <html lang="pt-BR" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} ${tektur.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main>
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {user ? (
                    <div className="hidden lg:block lg:col-span-3">
                      <SideBar />
                    </div>
                  ) : (
                    <div className="lg:col-span-3">
                      <LoginCard />
                    </div>
                  )}
                  <div className="lg:col-span-9">
                    {children}
                  </div>
                </div>
              </div>
            </main>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
