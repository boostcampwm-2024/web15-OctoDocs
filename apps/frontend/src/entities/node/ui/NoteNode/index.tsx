import { FileText } from "lucide-react";
import { Handle, NodeProps, Position } from "@xyflow/react";

import { NoteNodeType } from "../../model/nodeTypes";
import { type User } from "@/entities/user";
import { ActiveUser, Emoji } from "@/shared/ui";

interface NoteNodeProps extends NodeProps<NoteNodeType> {
  isClicked: boolean;
  handleNodeClick: () => void;
  users: User[];
}

export function NoteNode({
  data,
  isClicked,
  users,
  handleNodeClick,
}: NoteNodeProps) {
  return (
    <div
      className={`h-24 w-48 rounded-lg border-[1px] ${isClicked ? "border-[#8dbaef]" : "border-[#eaeaea]"} bg-white p-3 shadow-sm`}
      onClick={handleNodeClick}
    >
      <Handle
        type="source"
        id="left"
        position={Position.Left}
        isConnectable={true}
      />
      <Handle
        type="source"
        id="top"
        position={Position.Top}
        isConnectable={true}
      />
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        isConnectable={true}
      />
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        isConnectable={true}
      />
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex w-full min-w-0 flex-row items-center justify-start gap-1">
          {data.emoji ? (
            <Emoji emoji={data.emoji} />
          ) : (
            <FileText
              className="h-4 w-4 flex-shrink-0"
              strokeWidth="1.5px"
              color="#91918e"
            />
          )}
          <div className="w-full truncate">{data.title}</div>
        </div>
        <ActiveUser className="self-end" users={users} />
      </div>
    </div>
  );
}
