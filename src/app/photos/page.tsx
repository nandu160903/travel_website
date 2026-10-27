import { PhotosGallery } from "@/components/gallery/PhotosGallery";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionHeading } from "@/components/animation/SectionHeading";
import { getPhotos } from "@/lib/data/queries";
import { seoPageTitle } from "@/lib/config";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: seoPageTitle("Photos"),
  description: "Travel photography from journeys around the world.",
  path: "/photos",
});

export default async function PhotosPage() {
  const photos = await getPhotos();

  return (
    <PublicLayout>
      <section className="pt-32 pb-24 px-6 md:px-8 max-w-7xl mx-auto">
        <SectionHeading
          label="Gallery"
          title="Photo Stories"
          subtitle="Frames from high passes, desert highways, and chai stops along the way."
        />
        <PhotosGallery photos={photos} />
      </section>
    </PublicLayout>
  );
}
