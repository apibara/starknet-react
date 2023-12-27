import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const bnToHex = (bn: bigint): string => {
  const bigIntValue = BigInt(bn);
  const hexString = bigIntValue.toString(16).padStart(64, "0");

  const address = "0x" + hexString;
  return address;
};
