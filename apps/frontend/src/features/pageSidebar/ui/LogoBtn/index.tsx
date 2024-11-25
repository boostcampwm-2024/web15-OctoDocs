import logo from "/icons/logo.png?url";

interface LogoBtnProps {
  onClick?: () => void;
}

export function LogoBtn({ onClick }: LogoBtnProps) {
  return (
    <button
      className="h-8 w-8 overflow-clip rounded-md bg-[#231f20] p-1"
      onClick={onClick}
    >
      <img src={logo} />
    </button>
  );
}
