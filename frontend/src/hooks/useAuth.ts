"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../services/supabase";

export function useAuth() {
  const router = useRouter();
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        if (!currentSession) {
          router.push("/login");
        }
      });

      subscriptionRef.current = subscription;
    };

    init();

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return { signOut };
}
