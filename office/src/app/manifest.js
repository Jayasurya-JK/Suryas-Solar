export default function manifest() {
  return {
    name: "Surya's Solar Office",
    short_name: "Suryas Office",
    description: "Quotes, leads and expenses for Surya's Solar",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f4bd6",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
}
