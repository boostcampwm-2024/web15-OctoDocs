interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  CheckedIcon: React.ComponentType<{ className?: string }>;
  UncheckedIcon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export function Switch({
  checked,
  onChange,
  CheckedIcon,
  UncheckedIcon,
  disabled,
}: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-lg border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        checked ? "bg-[#b2ffba]" : "bg-gray-200"
      }`}
      disabled={disabled}
    >
      <div
        className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-md bg-white text-gray-500 shadow-lg ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      >
        {checked ? (
          <CheckedIcon className="h-3 w-3" />
        ) : (
          <UncheckedIcon className="h-3 w-3" />
        )}
      </div>
    </button>
  );
}
