"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111]">
      <SignIn appearance={{ baseTheme: dark }} />
    </div>
  );
}
