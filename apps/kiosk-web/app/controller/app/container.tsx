export default function Container({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <div className="flex-1 flex flex-col items-stretch h-full min-h-screen bg-gradient-to-b from-[#151515] to-[#121212] text-white">
      {children}
    </div>
  );
}
