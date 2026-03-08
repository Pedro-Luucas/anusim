"use client";

import { useEffect, useState } from "react";

type SampleResponse = {
  message: string;
  timestamp: string;
};

export default function SamplePage() {
  const [data, setData] = useState<SampleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sample")
      .then((res) => res.json())
      .then((json: SampleResponse) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch from API.");
        setLoading(false);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold">Sample Page</h1>
      <p className="text-zinc-500">
        This page fetches data from{" "}
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800">
          /api/sample
        </code>
      </p>

      <div className="w-full max-w-sm rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
        {loading && <p className="text-zinc-400">Loading…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {data && (
          <dl className="flex flex-col gap-3 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Message
              </dt>
              <dd className="mt-1 font-medium">{data.message}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Timestamp
              </dt>
              <dd className="mt-1 font-medium">{data.timestamp}</dd>
            </div>
          </dl>
        )}
      </div>

      <a href="/" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
        ← Back home
      </a>
    </main>
  );
}
