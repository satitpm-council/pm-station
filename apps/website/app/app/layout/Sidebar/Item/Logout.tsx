import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { Menu, MenuItem } from "@/components/Sidebar";
import { Suspense } from "react";
import { CSRFTokenField } from "@/auth/components";

export function LogoutItem() {
  return (
    <form method="post" action="/api/auth/signout">
      <Suspense fallback={null}>
        <CSRFTokenField />
      </Suspense>
      <button className="w-full" type="submit" title="ออกจากระบบ">
        <Menu className="border-gray-600">
          <MenuItem icon={<ArrowLeftOnRectangleIcon className="h-4 w-4" />}>
            ออกจากระบบ
          </MenuItem>
        </Menu>
      </button>
    </form>
  );
}
