"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppShell";
import { Spinner } from "@/components/ui";

export default function Home() {
  const { home } = useApp();
  const router = useRouter();
  useEffect(() => { router.replace(home); }, [home, router]);
  return <Spinner />;
}
