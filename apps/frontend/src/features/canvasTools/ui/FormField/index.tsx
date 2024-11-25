interface FormFieldProps {
  label: string;
  input: React.ReactNode;
}

export function FormField({ label, input }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-medium text-[#433d3f]">{label}</label>
      {input}
    </div>
  );
}
