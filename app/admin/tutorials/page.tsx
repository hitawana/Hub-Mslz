import { AdminTutorialsClient } from "@/components/admin/AdminTutorialsClient";
import { requireAdminPage } from "@/lib/server/requireAdminPage";
import { getAllPlatforms, getAllTutorialsAdmin } from "@/lib/server/tutorials";

export default async function AdminTutorialsPage() {
  await requireAdminPage();

  const [tutorials, platforms] = await Promise.all([
    getAllTutorialsAdmin(),
    getAllPlatforms()
  ]);

  return (
    <AdminTutorialsClient
      initialTutorials={tutorials}
      initialPlatforms={platforms}
    />
  );
}
