module.exports = {
    siteUrl: process.env.BASE_URL || "https://quaversv.com",
    generateRobotsTxt: true,
    changefreq: "daily",
    priority: 0.7,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin"],
            },
        ],
    },
};
