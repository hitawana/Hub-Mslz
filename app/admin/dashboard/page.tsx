import { requireAdminPage } from "@/lib/server/requireAdminPage";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboardPage() {
  const user = await requireAdminPage();
  return <AdminDashboardClient email={user.email} />;
}
