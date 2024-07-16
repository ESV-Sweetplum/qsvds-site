const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

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
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },
    async headers() {
        return [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Content-Security-Policy',
                value: cspHeader.replace(/\n/g, ''),
              },
            ],
          },
        ]
      },
};
