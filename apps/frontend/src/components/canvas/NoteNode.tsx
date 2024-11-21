import { Handle, NodeProps, Position, type Node } from "@xyflow/react";
import { FileText } from "lucide-react";

import ActiveUser from "../commons/activeUser";

import usePageStore from "@/store/usePageStore";
import useUserStore from "@/store/useUserStore";
import Emoji from "../commons/emoji";
import { useEffect, useState } from "react";

export type NoteNodeData = { title: string; id: number; emoji: string };
export type NoteNodeType = Node<NoteNodeData, "note">;

export function NoteNode({ data }: NodeProps<NoteNodeType>) {
  const { setCurrentPage } = usePageStore();
  const { users } = useUserStore();

  const [activeUsers, setActiveUsers] = useState(users);

  useEffect(() => {
    setActiveUsers(users);
  }, [users]);

  const handleNodeClick = () => {
    const id = data.id;
    if (id === undefined || id === null) {
      return;
    }

    setCurrentPage(id);
  };

  return (
    <div
      className="h-24 w-48 rounded-lg border-[1px] border-[#eaeaea] bg-white p-3 shadow-sm"
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
        <ActiveUser
          className="self-end"
          users={activeUsers.filter(
            (user) => user.currentPageId === data.id.toString(),
          )}
        />
      </div>
    </div>
  );
}
