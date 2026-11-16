
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseTestPage() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("businesses")
        .select("id")
        .limit(1);

      if (error) {
        setStatus("Database error: " + error.message);
      } else {
        setStatus(`Connected! Records found: ${data.length}`);
      }
    }

    testConnection();
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <h1>Supabase Connection Test</h1>
      <p>{status}</p>
    </main>
  );
}
