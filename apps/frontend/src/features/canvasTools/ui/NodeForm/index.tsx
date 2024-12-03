import { usePopover } from "@/shared/model";

interface NodeFormProps {
  changeNodeColor: (color: string) => void;
}

export function NodeForm({ changeNodeColor }: NodeFormProps) {
  const { close } = usePopover();

  const nodeBackgroundColors = {
    white: "#FFFFFF",
    grey: "#F1F1EF",
    brown: "#F4EEEE",
    orange: "#FBEBDD",
    yellow: "#FCF3DB",
    green: "#EDF3ED",
    blue: "#E7F3F8",
    purple: "#F7F3F8",
    pink: "#FBF2F5",
    red: "#FDEBEC",
  };

  const handleButtonClick = (color: string) => {
    changeNodeColor(color);
    close();
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-neutral-500">Background color</p>
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(nodeBackgroundColors).map(([key, color]) => {
          return (
            <button
              key={key}
              onClick={() => handleButtonClick(color)}
              className="h-7 w-7 rounded-md border-[1px] border-neutral-300 hover:cursor-pointer"
              style={{ backgroundColor: color }}
            />
          );
        })}
      </div>
    </div>
  );
}
