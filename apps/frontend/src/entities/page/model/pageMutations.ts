import { useMutation } from "@tanstack/react-query";

import { CreatePageRequest } from "./pageTypes";
import { createPage, deletePage } from "../api/pageApi";

export const useCreatePage = () => {
  return useMutation({
    mutationFn: ({
      title,
      content,
      x,
      y,
      emoji,
      workspaceId,
    }: CreatePageRequest) =>
      createPage({ title, content, x, y, emoji, workspaceId }),
  });
};

export const useDeletePage = () => {
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deletePage(id),
  });
};
