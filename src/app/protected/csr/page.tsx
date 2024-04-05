"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function ProtectedCsrPage() {
  const { user, error, isLoading } = useUser();

  return <div>Hello {user?.name}</div>;
}
