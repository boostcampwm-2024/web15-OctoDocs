import { cn } from "@/lib/utils";

const sideStyle: { readonly [key in Side]: string } = {
  left: "left-0",
  right: "right-0 ",
  top: "top-0 left-1/2 -translate-x-1/2",
  bottom: "bottom-0 left-1/2 -translate-x-1/2",
};

type Side = "left" | "right" | "top" | "bottom";

type SideWrapperProps = {
  side: Side;
  children: React.ReactNode;
  className?: string;
};

export default function SideWrapper({
  side,
  children,
  className,
}: SideWrapperProps) {
  return (
    <div className={cn(`absolute z-40 ${sideStyle[side]} `, className)}>
      {children}
    </div>
  );
}
