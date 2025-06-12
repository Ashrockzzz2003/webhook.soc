import "./globals.css";
import localFont from "next/font/local";
import ClientSessionWrapper from "./_util/ClientSessionWrapper";

const gilroy = localFont({
  src: [
    {
      path: "_fonts/Gilroy-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "_fonts/Gilroy-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
    {
      path: "_fonts/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "_fonts/Gilroy-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "_fonts/Gilroy-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "_fonts/Gilroy-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "_fonts/Gilroy-Heavy.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "_fonts/Gilroy-HeavyItalic.ttf",
      weight: "900",
      style: "italic",
    },
    {
      path: "_fonts/Gilroy-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "_fonts/Gilroy-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "_fonts/Gilroy-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "_fonts/Gilroy-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "_fonts/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "_fonts/Gilroy-RegularItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "_fonts/Gilroy-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "_fonts/Gilroy-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "_fonts/Gilroy-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "_fonts/Gilroy-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "_fonts/Gilroy-UltraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "_fonts/Gilroy-UltraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
  ],
  display: "swap",
});

export const metadata = {
  title: "SoC | Setup Webhooks",
  description: "Setup Webhooks for your repo to sync with SoC",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={gilroy.className}>
        <ClientSessionWrapper>{children}</ClientSessionWrapper>
      </body>
    </html>
  );
}
