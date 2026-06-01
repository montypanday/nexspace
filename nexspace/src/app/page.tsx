import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TabsIcons } from "@/components/nav-tabs";
import { SpaceCard } from "@/components/space-card";
import { getAvailableSpaces } from "@/data/space";

export default async function Home() {

  const spaces = await getAvailableSpaces();
  console.log(spaces)
  return (
    <div className="flex min-h-screen items-center justify-center font-sans dark:bg-black">
      <main className="flex gap-4 min-h-screen w-full flex-col items-center justify-start mt-6 px-16 bg-white dark:bg-black sm:items-start">
        <TabsIcons />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {spaces.map((space) => <SpaceCard key={space.id} space={space} />)}
        </div>
      </main>
    </div>
  );
}
