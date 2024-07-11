const headers = async () => [
    {
        // matching all API routes
        source: "/api/:path*",
        headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
            {
                key: "Access-Control-Allow-Methods",
                value: "GET,DELETE,PATCH,POST,PUT",
            },
            {
                key: "Access-Control-Allow-Headers",
                value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
            },
        ],
    },
];

module.exports = {
    sassOptions: {
        includePaths: [__dirname],
    },
    headers,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.quavergame.com",
                port: "",
                pathname: "/mapsets/**",
            },
            {
                protocol: "https",
                hostname: "avatars.steamstatic.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    reactStrictMode: false,
};
