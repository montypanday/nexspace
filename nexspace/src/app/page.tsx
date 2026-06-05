import { TabsIcons } from "@/components/nav-tabs";
import { getOrganizations } from "@/data/organization";
import { OrganizationCard } from "@/components/organization-card";

export default async function Home() {
  const organizations = await getOrganizations();
  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
        <TabsIcons />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Your Organisations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {organizations.map((organization) => <OrganizationCard key={organization.id} organization={organization} />)}
        </div>
      </main>
    </div>
  );
}
