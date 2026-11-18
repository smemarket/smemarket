import type { Metadata } from "next";
import Assessment from "@/components/forms/Assessment";

export const metadata: Metadata = {
  title: "Free growth assessment",
  description: "Score your search, ads, outreach, social, enquiries and website in 2 minutes. Free, instant, and no call needed.",
  alternates: { canonical: "/assessment" },
};

export default function AssessmentPage() {
  return (
    <section className="min-h-[100svh] bg-paper pb-16 pt-24 md:pb-24 md:pt-40">
      <div className="container-x">
        <Assessment />
      </div>
    </section>
  );
}
