import { MetadataRoute } from "next";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "https://simplyexpat.de";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: DOMAIN,
      lastModified: new Date("2026-05-09"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${DOMAIN}/faq`,
      lastModified: new Date("2026-05-09"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/what-is-anmeldung`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/anmeldung-online-non-eu`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/anmeldung-documents`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/wohnungsgeberbestaetigung`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/burgeramt-berlin-appointment`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${DOMAIN}/barrierefreiheit`,
      lastModified: new Date("2026-05-17"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
