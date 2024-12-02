import { useQuery, useMutation, skipToken } from "@tanstack/react-query";

import {
  CreatePageRequest,
  createPage,
  deletePage,
  getPage,
} from "@/entities/page";

export const usePage = (currentPage: number | null) => {
  const {
    data: page,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["page", currentPage],
    queryFn: currentPage ? () => getPage(currentPage) : skipToken,
  });

  return { page, isError, isLoading };
};

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
