export interface SaveStatusProps {
  saveStatus: "saved" | "unsaved";
}

export default function SaveStatus({ saveStatus }: SaveStatusProps) {
  return (
    <div className="absolute right-5 top-5 z-10">
      <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
        {saveStatus}
      </div>
    </div>
  );
}
