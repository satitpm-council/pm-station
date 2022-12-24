export default function ProjectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 flex flex-col text-4xl">{children}</div>;
}
