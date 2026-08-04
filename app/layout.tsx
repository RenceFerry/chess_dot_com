import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Notification from "./_components/notification";
import NotifProvider from "./_lib/context/notifContext"; 
import QueryProvider from '@/_lib/providers/QueryProvider';
import { ShowInvitationCardProvider } from "./_lib/context/showInvitationCardContext";
import { ConfirmationContextProvider } from "./_lib/context/confirmationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChessDotCom",
  description: "The no. 1 chess game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <NotifProvider>
    <ShowInvitationCardProvider>
    <ConfirmationContextProvider>
    <QueryProvider>
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-dvh relative no-text-cursor no-text-select min-h-0 min-w-0`}
        >
        <Notification />
        {children}
      </body>
    </html>
    </QueryProvider>
    </ConfirmationContextProvider>
    </ShowInvitationCardProvider>
    </NotifProvider>
  );
}
