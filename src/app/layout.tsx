import { Inter } from "next/font/google";
import "@radix-ui/themes/styles.css";

import NavBar from "@/components/NavBar";
import { CookiesProvider } from "next-client-cookies/server";
import { Analytics } from "@vercel/analytics/react";
import { Theme } from "@radix-ui/themes";
import Head from "next/head";

const environment =
    process.env.NODE_ENV === "development" ? "development" : "production";

export const metadata = {
    title: `QuaverSV${environment === "development" ? " Dev Environment" : ""}`,
    description: "I have literally no idea what I'm doing, send help.",
};

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable}>
            <Head>
                <meta property="og:title" content={metadata.title} />
                <meta
                    property="og:description"
                    content={metadata.description}
                />
                <meta property="og:type" content="website" />
                <meta name="theme-color" content="#5105ad" />
            </Head>
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
                    </CookiesProvider>
                </Theme>
            </body>
        </html>
    );
}
