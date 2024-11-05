import logo from "/logo.png?url";

export default function LogoBtn() {
  return (
    <div className="h-8 w-8 rounded-md bg-slate-700 p-2">
      <img src={logo} />
    </div>
  );
}
