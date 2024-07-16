import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@radix-ui/themes/styles.css";

import NavBar from "@/components/NavBar";
import { CookiesProvider } from "next-client-cookies/server";
import { Analytics } from "@vercel/analytics/react";
import { Theme } from "@radix-ui/themes";
import { Viewport } from "next";

const environment =
    process.env.NODE_ENV === "development" ? "development" : "production";

export const metadata = {
    title: `Quaver SV Difficulty System${environment === "development" ? " | Dev Environment" : ""}`,
    description:
        "An all-purpose database for managing Quaver SV players and maps.",
    openGraph: {
        title: "Quaver SV Difficulty System",
        description:
            "An all-purpose database for managing Quaver SV players and maps.",
        url: "https://quaversv.com",
        siteName: "QSVDS",
        type: "website",
    },
};

export const viewport: Viewport = {
    themeColor: "#5105ad",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <body>
                <Theme
                    accentColor="violet"
                    grayColor="mauve"
                    panelBackground="translucent"
                    scaling="100%"
                    radius="full"
                    appearance="dark"
                >
                    <CookiesProvider>
                        <NavBar />
                        {children}
                        <Analytics />
                        <GoogleAnalytics gaId="G-XXHWM98XS0" />
                    </CookiesProvider>
                </Theme>
            </body>
        </html>
    );
}
