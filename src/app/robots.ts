import type { MetadataRoute } from "next";

import { env } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/services/"],
      disallow: [
        "/account",
        "/admin/",
        "/dashboard/",
        "/provider/",
        "/book/",
        "/bookings/",
        "/wallet/",
        "/forbidden",
        "/login",
        "/register",
        "/auth/",
        "/api/",
      ],
    },
    sitemap: `${env.SITE_URL.replace(/\/$/, "")}/sitemap.xml`,
  };
}
