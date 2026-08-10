"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface PreviewPageProps {
  params: Promise<{ username: string }>;
}

export default function ProtectedPreviewPage({ params }: PreviewPageProps) {
  const resolvedParams = use(params);
  const { username } = resolvedParams;
  const router = useRouter();

  useEffect(() => {
    // Redirect preview directly to the clean public portfolio
    router.replace(`/portfolio/${username}`);
  }, [username, router]);

  return null;
}
