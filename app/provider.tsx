"use client";
import { Toaster } from "@/components/ui/sonner";
import { Provider as JotaiProvider } from "jotai";
interface Props {
  children: React.ReactNode;
}
export default function Provider({ children }: Props) {
  return (
    <div>
      <JotaiProvider>
        <Toaster richColors={true} position="top-center" />
        {children}
      </JotaiProvider>
    </div>
  );
}
