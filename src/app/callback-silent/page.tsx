"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      router.push("/");
    } else {
      sessionStorage.setItem("auth_user", "1");
      router.push("/"); //or go to app
    }
  }, [error]);
}
