import { Inter } from "next/font/google";

import NavBar from "@/components/NavBar";
import { CookiesProvider } from "next-client-cookies/server";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
    title: "QuaverSV",
    description: "I have literally no idea what I'm doing, send help.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <CookiesProvider>
                    <NavBar />
                    {children}
                    <Analytics />
                </CookiesProvider>
            </body>
        </html>
    );
}
