"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111]">
      <SignUp appearance={{ baseTheme: dark }} />
    </div>
  );
}
