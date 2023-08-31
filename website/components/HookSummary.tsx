import { Hook } from "@/components/Hook";

// rome-ignore lint: fix types
export default function HookSummary({ hook }: { hook: any }) {
  return <Hook.Summary hook={hook} />;
}
