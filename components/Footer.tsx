"use client";

import Link from "next/link";
import { MdiGithub } from "./icon/github";

export default function Footer() {
  return (
    <footer className="text-white text-center bg-foreground w-full py-2 space-y-1">
      <Link
        href={"https://github.com/bnsx/image-size-reducer"}
        className="flex justify-center"
      >
        <MdiGithub className="w-7 h-7" />
      </Link>
      <div>
        © Powered by <span className="font-medium">BNSX</span>
      </div>
    </footer>
  );
}
