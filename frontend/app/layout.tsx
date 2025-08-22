import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { getLocale, getMessages } from 'next-intl/server';
import ConditionalLayout from '@/components/ConditionalLayout';
import ConditionalChatbotProvider from '@/components/ConditionalChatbotProvider';

const inter = Inter({
  subsets: ['latin'],
  fallback: ['system-ui', 'arial']
});

export async function generateMetadata(): Promise<Metadata> {
  // Since we're not using routing, we'll use a simple approach
  return {
    title: "CropCare - Plant Disease Detection",
    description: "Identify plant diseases and get treatment recommendations"
  };
}

export default async function RootLayout({
  children}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ConditionalChatbotProvider>
              <ConditionalLayout>{children}</ConditionalLayout>
            </ConditionalChatbotProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}