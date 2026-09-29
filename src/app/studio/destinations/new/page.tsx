import { DestinationEditor } from "@/components/studio/DestinationEditor";

export default function NewDestinationPage() {
  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="font-display text-3xl mb-8">New Destination</h1>
      <DestinationEditor />
    </div>
  );
}
