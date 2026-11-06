"use client";

import React, { useEffect, useState } from "react";

type State = { status: "loading" } | { status: "done"; text: string } | { status: "error" };

export const AiSummary: React.FC<{ title: string }> = ({ title }) => {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    fetch(`/api/summary?title=${encodeURIComponent(title)}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("failed"))))
      .then((d) => setState({ status: "done", text: d.summary }))
      .catch((e) => {
        if (e?.name !== "AbortError") setState({ status: "error" });
      });
    return () => controller.abort();
  }, [title]);

  if (state.status === "error") return null;

  return (
    <section className="mb-8 sm:mb-10 p-4 sm:p-6 bg-crimson/5 rounded-2xl border border-crimson/20">
      <span className="text-xs font-mono uppercase tracking-widest text-crimson font-medium block mb-2">
        Tóm tắt nội dung
      </span>
      {state.status === "loading" ? (
        <div className="space-y-2 animate-pulse" aria-busy="true">
          <div className="h-3 bg-paper-300/60 rounded w-full" />
          <div className="h-3 bg-paper-300/60 rounded w-11/12" />
          <div className="h-3 bg-paper-300/60 rounded w-4/5" />
        </div>
      ) : (
        <p className="font-serif text-base text-paper-800 leading-relaxed">{state.text}</p>
      )}
    </section>
  );
};
