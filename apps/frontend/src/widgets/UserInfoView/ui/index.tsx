import { useState } from "react";

import { UserProfile } from "@/entities/user";
import { LoginForm, Logout, useGetUser } from "@/features/auth";
import { LogoBtn } from "@/features/pageSidebar";
import {
  WorkspaceAddButton,
  WorkspaceForm,
  WorkspaceList,
} from "@/features/workspace";
import { Divider, Popover } from "@/shared/ui";

export function UserInfoView() {
  const { data } = useGetUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpenModal = () => {
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <Popover align="start" offset={{ x: -7, y: 16 }}>
        <Popover.Trigger>
          <LogoBtn />
        </Popover.Trigger>
        <Popover.Content className="w-[280px] rounded-lg border border-neutral-200 bg-white px-4 py-4 shadow-md">
          {data ? (
            <div className="flex flex-col gap-1">
              <UserProfile nickname={data.snowflakeId ?? "123"} />
              <Divider direction="horizontal" className="h-0.5" />
              <WorkspaceList />
              <WorkspaceForm
                isModalOpen={isModalOpen}
                onCloseModal={onCloseModal}
              />
              <Divider direction="horizontal" className="h-0.5" />
              <div className="flex w-full flex-col">
                <WorkspaceAddButton onClick={onOpenModal} />
                <Logout />
              </div>
            </div>
          ) : (
            <LoginForm />
          )}
        </Popover.Content>
      </Popover>
    </div>
  );
}
