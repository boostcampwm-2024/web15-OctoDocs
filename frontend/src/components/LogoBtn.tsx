import logo from "/logo.png?url";

export default function LogoBtn() {
  return (
    <div className="h-8 w-8 overflow-clip rounded-md">
      <img src={logo} />
    </div>
  );
}
