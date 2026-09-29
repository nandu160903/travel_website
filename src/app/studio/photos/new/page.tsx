import { PhotoEditor } from "@/components/studio/PhotoEditor";

export default function NewPhotoPage() {
  return (
    <div className="p-8 md:p-10 max-w-3xl">
      <h1 className="font-display text-3xl mb-8">Add Photo</h1>
      <PhotoEditor />
    </div>
  );
}
