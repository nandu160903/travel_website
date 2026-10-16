import { PublicLayout } from "@/components/layout/PublicLayout";
import { Hero } from "@/components/sections/Hero";
import { WondersOfNature } from "@/components/sections/WondersOfNature";
import { ChoosingUs } from "@/components/sections/ChoosingUs";
import { PerfectVacation } from "@/components/sections/PerfectVacation";
import { ExploreNature } from "@/components/sections/ExploreNature";
import { getSiteSettings, getDestinations } from "@/lib/data/queries";

export default async function HomePage() {
  const [settings, destinations] = await Promise.all([
    getSiteSettings(),
    getDestinations(),
  ]);

  const featuredFirst = [
    ...destinations.filter((d) => d.featured),
    ...destinations.filter((d) => !d.featured),
  ];

  return (
    <PublicLayout transparentHeader>
      <Hero heroImage={settings.heroImage} />
      <WondersOfNature destinations={featuredFirst} />
      <ChoosingUs />
      <PerfectVacation />
      <ExploreNature />
    </PublicLayout>
  );
}
