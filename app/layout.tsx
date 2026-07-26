import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Route DJ — AI-assisted music journeys",
  description:
    "A frontend-only prototype for navigating a continuous musical route.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
