export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="sticky top-0 z-10 flex items-center justify-between w-full h-16 px-4 bg-white border-b border-gray-200">
        <b>Nav</b>
      </nav>
      <main className="px-4 py-6 h-full flex-grow">{children}</main>
    </>
  );
}
