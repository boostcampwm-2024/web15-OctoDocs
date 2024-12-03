import { useState } from "react";
import { Globe2, Lock, Copy, CheckCheck } from "lucide-react";

import { Switch } from "@/shared/ui";

export function SharePanel() {
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const url = "https://octodocs.com";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <div className="flex w-full flex-row justify-between p-1">
        <div className="flex flex-row items-center gap-2">
          <div className="flex-row text-sm text-slate-400">공개 범위</div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={isPublic}
              onChange={setIsPublic}
              CheckedIcon={Globe2}
              UncheckedIcon={Lock}
            />
          </div>
        </div>
        <div className="select-none flex-row text-sm text-slate-400">
          🚧 수정 중입니다.
        </div>
      </div>
      <div
        className={`flex w-full items-center justify-between gap-2 py-2 ${
          !isPublic ? "opacity-50" : ""
        }`}
      >
        <div className="w-48 flex-1 truncate rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-600">
          {isPublic ? url : "비공개 모드입니다."}
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Copy URL"
          disabled={!isPublic}
        >
          {copied ? (
            <CheckCheck className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );
}

export default SharePanel;
