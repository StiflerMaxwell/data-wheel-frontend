export const siteConfig = {
  name: "奢侈品电商数据分析平台",
  url: "https://dashboard.tremor.so",
  description: "奢侈品电商数据分析平台仪表盘",
  baseLinks: {
    home: "/",
    overview: "/dashboard",
    details: "/dashboard",
    pageOptimization: "/dashboard/page-optimization",
    utmFunnel: "/dashboard/utm-funnel",
    insights: "/dashboard/insights",
    settings: {
      general: "/settings/general",
      billing: "/settings/billing",
      users: "/settings/users",
    },
  },
}

export type siteConfig = typeof siteConfig
