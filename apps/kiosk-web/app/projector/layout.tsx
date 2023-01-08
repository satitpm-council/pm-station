export default function ControllerLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <div className="h-full min-h-screen flex">
      <div
        style={{ zoom: 0.8 }}
        className="text-2xl bg-gradient-to-b from-[#151515] to-[#121212] text-white flex-1 flex flex-col"
      >
        {children}
      </div>
    </div>
  );
}
