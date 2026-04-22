import type { Metadata } from "next";
import BuildingPage from "./BuildingPage";

export const metadata: Metadata = {
  title: "Building — Kyle Morgan",
  description:
    "Honest progress reports from agentic projects I'm shipping right now. Rough edges included.",
};

export default function Page() {
  return <BuildingPage />;
}
