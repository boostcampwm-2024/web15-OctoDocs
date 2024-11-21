export interface SaveStatusProps {
  saveStatus: "saved" | "unsaved";
}

export default function SaveStatus({ saveStatus }: SaveStatusProps) {
  return (
    <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
      {saveStatus}
    </div>
  );
}
