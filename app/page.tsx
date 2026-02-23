"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";
import HomeLayout from "./components/home/HomeLayout";

export default function Home() {
  const { isSignedIn } = useUser();
  const createUser = useMutation(
    api.controllers.user.createUserIfNotExists.createUserIfNotExists,
  );

  useEffect(() => {
    if (isSignedIn) {
      createUser();
    }
  }, [isSignedIn]);

  return <HomeLayout />;
}
