import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2027 Training Calendar | Dobot EMEA",
  description: "Explore the proposed Dobot EMEA 2027 training calendar and quarterly webinars.",
};

export default function CalendarPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f1f6fd]">
      <nav aria-label="Training navigation" className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d8e4f1] px-5 py-3 text-sm text-[#486889] sm:px-10">
        <Link href="/" className="font-medium underline underline-offset-4">
          Back to training registration
        </Link>
        <a href="/training-calendar-2027.html" download="Dobot_EMEA_Training_Calendar_2027_v1.1.html" className="underline underline-offset-4">
          Download standalone calendar
        </a>
      </nav>
      <iframe
        src="/training-calendar-2027.html?registration=1"
        title="Dobot EMEA 2027 training calendar"
        className="min-h-[calc(100dvh-60px)] w-full flex-1 border-0"
      />
    </main>
  );
}


