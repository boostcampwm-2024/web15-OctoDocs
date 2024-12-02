import { useMutation } from "@tanstack/react-query";

import { CreatePageRequest, createPage, deletePage } from "@/entities/page";

export const useCreatePage = () => {
  return useMutation({
    mutationFn: ({ title, content, x, y, emoji }: CreatePageRequest) =>
      createPage({ title, content, x, y, emoji }),
  });
};

export const useDeletePage = () => {
  return useMutation({
    mutationFn: ({ id }: { id: number }) => deletePage(id),
  });
};
