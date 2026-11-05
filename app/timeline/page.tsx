"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { TimelineExplorer } from "@/components/timeline/TimelineExplorer";

export default function TimelinePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper-50 text-paper-800/60">
          <Loader2 className="h-5 w-5 animate-spin text-crimson" />
        </div>
      }
    >
      <TimelineContent />
    </Suspense>
  );
}

function TimelineContent() {
  const param = parseInt(useSearchParams().get("year") ?? "", 10);
  return <TimelineExplorer initialYear={isNaN(param) ? 938 : param} />;
}
