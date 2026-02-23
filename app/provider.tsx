"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { LastSeenUpdater } from "./lib/helpers/LastSeenUpdater";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/login"
      signUpUrl="/signup"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <LastSeenUpdater />
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
