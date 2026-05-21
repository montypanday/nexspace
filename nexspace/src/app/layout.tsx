import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, OrganizationSwitcher, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/theme-toggle";

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
          <main>
            <ClerkProvider>
              <header className="flex justify-end items-center p-4 gap-4 h-16">
                <Show when="signed-out">
                  <SignInButton />
                  <SignUpButton>
                    <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                      Sign Up
                    </button>
                  </SignUpButton>
                </Show>
                <Show when="signed-in">
                  <ModeToggle />
                  <OrganizationSwitcher />
                  <UserButton />
                </Show>
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <TooltipProvider>
                  <SidebarProvider>
                    <Sidebar />
                    <main className="relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2">
                      <SidebarTrigger />
                      <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            {children}
                          </div>
                        </div>
                      </div>
                    </main>
                  </SidebarProvider>
                </TooltipProvider>
              </div>
            </ClerkProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
