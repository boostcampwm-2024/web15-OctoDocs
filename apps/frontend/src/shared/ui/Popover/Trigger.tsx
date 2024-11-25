import { usePopover } from "@/shared/model/usePopover";

interface TriggerProps {
  children: React.ReactNode;
}

export function Trigger({ children }: TriggerProps) {
  const { open, setOpen, triggerRef } = usePopover();

  return (
    <div ref={triggerRef} onClick={() => setOpen(!open)}>
      {children}
    </div>
  );
}
