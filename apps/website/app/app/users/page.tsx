import { listUsers } from "@/auth/server";
import { UserTable } from "./table";

export default async function UserListPage() {
  const users = await listUsers();
  return (
    <div>
      <UserTable data={users} />
    </div>
  );
}
