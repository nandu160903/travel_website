import { SettingsForm } from "@/components/studio/SettingsForm";
import { getStudioSiteSettings } from "@/lib/data/studio-queries";

export default async function StudioSettingsPage() {
  const settings = await getStudioSiteSettings();

  return (
    <div className="p-8 md:p-10 max-w-2xl">
      <h1 className="font-display text-3xl mb-8">Settings</h1>
      <SettingsForm initial={settings} />
    </div>
  );
}
