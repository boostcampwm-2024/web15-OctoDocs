import logo from "/logo.png?url";

interface LogoBtnProps {
  onClick?: () => void;
}
export default function LogoBtn({ onClick }: LogoBtnProps) {
  return (
    <button className="h-8 w-8 overflow-clip rounded-md" onClick={onClick}>
      <img src={logo} />
    </button>
  );
}
