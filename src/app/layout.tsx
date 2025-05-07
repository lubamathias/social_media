import type { Metadata } from "next";import {
  ClerkProvider
} from '@clerk/nextjs'
import { Geist, Geist_Mono, Tektur } from "next/font/google";
import "./globals.scss";
import { ThemeProvider } from "@/components/ThemeProvider"
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

const tektur = Tektur ({
  variable: "--font-tektur",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  // Base URL do seu site — usado para gerar URLs absolutas
  metadataBase: new URL('https://conexa.app'),

  // Título principal, com template para subpáginas
  title: {
    default: 'Convexa | Rede Social de Networking para Profissionais de Tecnologia',
    template: '%s | Convexa',
  },

  // Descrição / meta description
  description:
    'Conexa é a rede social que conecta profissionais de tecnologia num ambiente interativo. Compartilhe projetos, receba feedback e amplie sua rede de contatos de forma inteligente.',

    icons: {
      icon: '/favicon.svg',
    },

  // Palavras-chave relevantes
  keywords: [
    'rede social',
    'networking',
    'tecnologia',
    'profissionais de TI',
    'UX/UI',
    'Conexa',
  ],

  // Autor(es) do site
  authors: [
    { name: 'Luciano', url: 'https://linkedin.com/in/seu-perfil' }
  ],

  // Criador do conteúdo (opcional)
  creator: 'Conexa Team',

  // Instruções para crawlers
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

  // Ícones e manifest

  manifest: '/site.webmanifest',

  // Open Graph para redes sociais (Facebook, LinkedIn etc.)
  openGraph: {
    title: 'Conexa | Rede Social de Networking para Profissionais de Tecnologia',
    description:
      'Junte-se à Conexa para compartilhar projetos de tecnologia, trocar feedback e expandir sua rede de contatos.',
    url: 'https://conexa.app',
    siteName: 'Conexa',
    images: [
      {
        url: 'https://conexa.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Logo Conexa e conexões em rede',
      },
    ],
    locale: 'pt-BR',
    type: 'website',
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Conexa | Networking para Profissionais de Tecnologia',
    description:
      'Conexa conecta desenvolvedores e designers num espaço colaborativo. Veja como ampliar sua rede!',
    creator: '@SeuHandleNoTwitter',
    images: ['https://conexa.app/og-image.png'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const user = await currentUser()
  return (
    <ClerkProvider>

      <html lang="pt-BR" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${tektur.variable} antialiased`}
        >


          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >

            <div>
              <Header/>

              <main className="">
                <div className="max-w-7xl mx-auto px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {user ? (

                      <div className="hidden lg:block lg:col-span-3">
                        <SideBar/>
                      </div>
                    ): (
                      <div className="lg:col-span-3">
                        <LoginCard/>
                      </div>
                    )}
                    <div className="lg:col-span-9">
                      {children}
                    </div>
                  </div>

                </div>
              </main>

            </div>
            
          </ThemeProvider>
          <Toaster/>

        </body>
      </html>

    </ClerkProvider>
  );
}
