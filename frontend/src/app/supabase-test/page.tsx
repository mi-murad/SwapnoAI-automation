
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SupabaseTestPage() {
  const [status, setStatus] = useState("Checking login session...");
  const [details, setDetails] = useState("");

  useEffect(() => {
    async function testConnection() {
      try {
        // Step 1: Check whether a user session exists
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (!session) {
          setStatus("Not authenticated");
          setDetails("Please sign in at /login first.");
          return;
        }

        setStatus("Authenticated");
        setDetails(`Signed in as: ${session.user.email ?? "User"}`);

        // Step 2: Query the businesses table as the logged-in user
        const { data, error } = await supabase
          .from("businesses")
          .select("id")
          .limit(1);

        if (error) throw error;

        setStatus("Database connection successful");
        setDetails(
          `Authenticated user: ${session.user.email ?? "User"}\n` +
          `Business records returned: ${data?.length ?? 0}`
        );
      } catch (err) {
        const error = err as {
          message?: string;
          code?: string;
          details?: string;
          hint?: string;
        };

        setStatus("Database connection failed");
        setDetails(
          JSON.stringify(
            {
              message: error.message,
              code: error.code,
              details: error.details,
              hint: error.hint,
            },
            null,
            2
          )
        );
      }
    }

    testConnection();
  }, []);

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1>Supabase Connection Test</h1>

      <h2>{status}</h2>

      <pre
        style={{
          background: "#f3f4f6",
          padding: "20px",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
        }}
      >
        {details}
      </pre>

      <button
        onClick={() => window.location.reload()}
        style={{
          padding: "12px 20px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Test Again
      </button>
    </main>
  );
}
