import { PageHeader } from "@/components";
import { getUser } from "@/features/users";
import Image from "next/image";
import { redirect } from "next/navigation";

const overrideGoogleImageSize = (url: string) => {
  return url.replace(/=s\d+/, "=s640");
};

export default async function ViewUserPage({
  params,
}: {
  params: { uid: string };
}) {
  const user = await getUser(params.uid);
  if (!user) {
    redirect("/app/users");
  }
  return (
    <>
      <PageHeader title={"ดูข้อมูลผู้ใช้งาน"} />
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-8">
          <div>
            <Image
              src={overrideGoogleImageSize(user.image)}
              width={200}
              height={200}
              alt={user.name}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col gap-4">
            <b className="text-2xl">{user.name}</b>
            <span>
              User ID:{" "}
              <code className="p-2 bg-gray-700 border border-gray-900 rounded-lg">
                {user.id}
              </code>
            </span>
            <span>อีเมล: {user.email}</span>
          </div>
        </div>
      </div>
    </>
  );
}
