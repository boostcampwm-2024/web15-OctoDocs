import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";

import { useRemoveWorkspace } from "../../model/workspaceMutations";
import { useUserWorkspace } from "../../model/workspaceQuries";
import { WorkspaceRemoveModal } from "./WorkspaceRemoveModal";
import { usePopover } from "@/shared/model";

export function WorkspaceList() {
  const { data } = useUserWorkspace();
  const { workspaceId } = useParams({ strict: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState("");
  const removeMutation = useRemoveWorkspace();
  const { setOpen } = usePopover();
  const navigate = useNavigate();

  const onModalOpen = () => {
    setIsModalOpen(true);
  };

  const onConform = async () => {
    await removeMutation.mutateAsync(workspaceToDelete);
    setIsModalOpen(false);
    if (workspaceId === workspaceToDelete) {
      navigate({ to: "/" });
    }
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!data) return <div className="my-2">로딩중...</div>;

  return (
    <div className="my-2 flex flex-col">
      <WorkspaceRemoveModal
        isOpen={isModalOpen}
        onCloseModal={onCloseModal}
        onConfirm={onConform}
      />
      <Link
        href="/"
        onClick={() => setOpen(false)}
        className="flex items-center gap-2 py-2 hover:cursor-pointer hover:bg-[#f5f5f5]"
      >
        <div className="h-6 w-6 rounded-md bg-neutral-300"></div>
        공용 워크스페이스
        {workspaceId === undefined && <Check width={18} height={18} />}
      </Link>
      {data.workspaces.map((workspace) => (
        <Link
          href={`/workspace/${workspace.workspaceId}`}
          onClick={() => setOpen(false)}
          key={workspace.workspaceId}
          className="group flex justify-between py-2 hover:cursor-pointer hover:bg-[#f5f5f5]"
        >
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-neutral-300"></div>
            <a className="">{workspace.title}</a>
            {workspace.workspaceId === workspaceId && (
              <Check width={18} height={18} />
            )}
          </div>
          <span
            className="transition-color mr-2 hidden text-neutral-400 group-hover:block hover:text-red-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWorkspaceToDelete(workspace.workspaceId);
              onModalOpen();
            }}
          >
            <Trash2 width={18} height={18} />
          </span>
        </Link>
      ))}
    </div>
  );
}
