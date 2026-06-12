import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/theme-toggle";
import { NavUser } from "@/components/nav-user";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarIcon, GroupIcon } from "lucide-react";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexspace",
  description: "Nexspace Space Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <main>
              <header className="flex items-center p-4 gap-4 h-16 justify-between">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground rounded-lg p-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard h-6 w-6"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">NextSpace</h1>
                      <p className="text-sm text-muted-foreground">Workspace Management</p>
                    </div>
                  </div>
                  <nav className="flex items-center gap-3">
                    <Link href="/">
                      <Button variant="outline" className="" data-icon="inline-start">
                        <GroupIcon />
                        Organizations
                      </Button>
                    </Link>
                    <Link href="/bookings">
                      <Button variant="outline" className="" data-icon="inline-start">
                        <CalendarIcon />
                        My Bookings
                      </Button>
                    </Link>
                  </nav>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <ModeToggle />
                  <NavUser />
                </div>
              </header>
              {children}
            </main>
          </SessionProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html >
  );
}
