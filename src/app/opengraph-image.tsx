import { ImageResponse } from "next/og";

import { messages } from "@/config/messages.fa";

export const alt = messages["seo.title"];
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        dir="rtl"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: "linear-gradient(135deg, #e8fbfd 0%, #ffffff 65%, #f0fbfc 100%)",
          color: "#153b45",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 88, fontWeight: 700 }}>{messages["brand.name"]}</div>
        <div style={{ display: "flex", marginTop: 26, fontSize: 38 }}>{messages["seo.description"]}</div>
      </div>
    ),
    size,
  );
}
