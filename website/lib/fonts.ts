import { Open_Sans, Overpass_Mono } from "next/font/google";

export const sansFont = Open_Sans({
  subsets: ["latin"],
  // weight: "400",
  variable: "--font-sans",
});

export const monoFont = Overpass_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});
