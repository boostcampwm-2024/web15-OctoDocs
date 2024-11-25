import {
  useQuery,
  useMutation,
  useQueryClient,
  skipToken,
} from "@tanstack/react-query";

import {
  getPages,
  createPage,
  deletePage,
  updatePage,
  getPage,
} from "@/entities/page/api/pageApi";
import {
  CreatePageRequest,
  UpdatePageRequest,
} from "@/entities/page/model/pageTypes";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, content, x, y, emoji }: CreatePageRequest) =>
      createPage({ title, content, x, y, emoji }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
};

export const useDeletePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deletePage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
};

export const usePages = () => {
  const { data: pages, isError } = useQuery({
    queryKey: ["pages"],
    queryFn: getPages,
  });

  return { pages, isError };
};

export const useOptimisticUpdatePage = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageData }: { pageData: UpdatePageRequest }) =>
      updatePage(id, pageData),
    onMutate: async ({ pageData }: { pageData: UpdatePageRequest }) => {
      await queryClient.cancelQueries({ queryKey: ["page", id] });

      const snapshot = queryClient.getQueryData(["page", id]);

      queryClient.setQueryData(["page", id], pageData);

      return () => {
        queryClient.setQueryData(["page", id], snapshot);
      };
    },
    onError: (_err, _variables, rollback) => {
      rollback?.();
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ["page", id] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
};
