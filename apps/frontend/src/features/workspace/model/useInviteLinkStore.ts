import { create } from "zustand";

type InviteLinkStore = {
  inviteLink: string | null;
  setInviteLink: (link: string) => void;
};

export const useInviteLinkStore = create<InviteLinkStore>((set) => ({
  inviteLink: null,
  setInviteLink: (link) => set({ inviteLink: link }),
}));
