import { Suspense } from "react";
import Spinner from "@/components/Spinner";
import ExploreClient from "./ExploreClient";

export const metadata = { title: "Explore Studios" };

export default function StudiosPage() {
  return (
    <Suspense fallback={<Spinner label="Loading studios..." />}>
      <ExploreClient />
    </Suspense>
  );
}
