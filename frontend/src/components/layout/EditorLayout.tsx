interface EditorLayoutProps {
  children: React.ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  return (
    <div className="relative h-[720px] w-[520px] overflow-auto border-muted bg-background bg-white sm:rounded-lg sm:border sm:shadow-lg">
      {children}
    </div>
  );
}
