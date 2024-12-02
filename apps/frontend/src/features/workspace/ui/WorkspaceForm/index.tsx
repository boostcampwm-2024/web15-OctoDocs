import { useState } from "react";

import { CreateWorkSpaceResquest } from "../../model/workspaceTypes";
import { Dialog, FormField } from "@/shared/ui";
import { useCreateWorkspace } from "../../model/useWorkspace";
import Button from "@/shared/ui/Button";

const initialFormInput: CreateWorkSpaceResquest = {
  title: "",
  description: "",
  thumbnailUrl: "",
  visibility: "public",
};

interface WorkspaceFormProps {
  isModalOpen: boolean;
  onCloseModal: () => void;
}

export function WorkspaceForm({
  isModalOpen,
  onCloseModal,
}: WorkspaceFormProps) {
  const [formInput, setFormInput] =
    useState<CreateWorkSpaceResquest>(initialFormInput);

  const addMutation = useCreateWorkspace();

  const handleButtonClick = () => {
    onCloseModal();
    setFormInput(initialFormInput);
    addMutation.mutate(formInput);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog isOpen={isModalOpen} onCloseModal={onCloseModal}>
      <Dialog.CloseButton onCloseModal={onCloseModal} />
      <div className="flex flex-col gap-4">
        <FormField
          label="워크스페이스 제목"
          input={
            <input
              className="h-8 rounded-md border-[1px] border-[#d0d9e0] bg-[#f5f6fa] px-2"
              value={formInput.title}
              name="title"
              onChange={handleInputChange}
            />
          }
        />
        <FormField
          label="워크스페이스 설명"
          input={
            <input
              className="h-8 rounded-md border-[1px] border-[#d0d9e0] bg-[#f5f6fa] px-2"
              value={formInput.description}
              name="description"
              onChange={handleInputChange}
            />
          }
        />
        <Button
          className="border-[1px] border-[#d0d9e0] bg-[#f5f5f5]"
          onClick={handleButtonClick}
        >
          추가
        </Button>
      </div>
    </Dialog>
  );
}
