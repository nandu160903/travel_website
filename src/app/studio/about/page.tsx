import { AboutPageEditor } from "@/components/studio/AboutPageEditor";
import { getStudioAboutPage } from "@/lib/data/studio-queries";

export default async function StudioAboutPage() {
  const about = await getStudioAboutPage();

  return (
    <div className="p-8 md:p-10 max-w-5xl">
      <p className="travel-meta text-olive mb-2">Content</p>
      <h1 className="font-display text-3xl font-bold mb-2">About Page</h1>
      <p className="text-muted text-sm mb-8 max-w-xl">
        Edit the public About page copy. Profile photo and short bio still live under Settings.
      </p>
      <AboutPageEditor initial={about} />
    </div>
  );
}
