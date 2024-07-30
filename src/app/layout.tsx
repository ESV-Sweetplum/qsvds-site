import { Inter } from "next/font/google";
import "@radix-ui/themes/styles.css";

import NavBar from "@/components/NavBar";
import { CookiesProvider } from "next-client-cookies/server";
import { Analytics } from "@vercel/analytics/react";
import { Theme } from "@radix-ui/themes";
import { Viewport } from "next";
import prisma from "../../prisma/initialize";
import { cookies } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";

const environment =
    process.env.NODE_ENV === "development" ? "development" : "production";

export const metadata = {
    title: `Quaver SV Difficulty System${environment === "development" ? " | Dev Environment" : ""}`,
    description:
        "An all-purpose database for managing Quaver SV players and maps. View ratings of SV maps, measure your progress through our internal leveling system, and improve your SV skills through progression trackers and SV courses. Login to start tracking now, free of charge.",
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

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let user_id = parseInt(cookies().get("user_id")?.value ?? "-6.9e6");
    if (isNaN(user_id)) user_id = -6.9e6;

    const user = await prisma.user.findUnique({
        where: {
            user_id,
        },
    });

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
                        <NavBar
                            user={user}
                            hash={cookies().get("hash")?.value ?? ""}
                        />
                        {children}
                        <Analytics />
                        <SpeedInsights />
                    </CookiesProvider>
                </Theme>
            </body>
        </html>
    );
}
