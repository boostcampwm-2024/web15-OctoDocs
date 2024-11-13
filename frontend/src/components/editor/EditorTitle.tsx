interface EditorTitleProps {
  title?: string;
  onTitleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EditorTitle({
  title,
  onTitleChange,
}: EditorTitleProps) {
  return (
    <div className="p-12 pb-0">
      <input
        type="text"
        className="w-full text-xl font-bold outline-none"
        value={title}
        onChange={onTitleChange}
      />
    </div>
  );
}
