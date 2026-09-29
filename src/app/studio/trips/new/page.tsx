import { TripEditor } from "@/components/studio/TripEditor";

export default function NewTripPage() {
  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="font-display text-3xl mb-8">New Journey</h1>
      <TripEditor />
    </div>
  );
}
