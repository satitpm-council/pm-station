export function HeaderLarge() {
  return (
    <div className="px-2 py-3 flex gap-4 items-center">
      <img
        draggable={false}
        src="/logo.png"
        alt="Logo"
        width="70"
        height="70"
      />
      <h1 className="text-3xl font-bold">PM Station</h1>
    </div>
  );
}

export function Header() {
  return (
    <div className="px-2 py-3 flex gap-2 items-center">
      <img
        draggable={false}
        src="/logo.png"
        alt="Logo"
        width="40"
        height="40"
      />
      <h1 className="text-xl font-bold">PM Station</h1>
    </div>
  );
}
