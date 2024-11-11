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
  type PageRequest,
  getPage,
  CreatePageRequest,
} from "@/api/page";

export const usePage = (currentPage: number | null) => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["page", currentPage],
    queryFn: currentPage ? () => getPage(currentPage) : skipToken,
  });

  return { data, isError, isLoading };
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, content, x, y }: CreatePageRequest) =>
      createPage({ title, content, x, y }),
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
  const { data, isError } = useQuery({
    queryKey: ["pages"],
    queryFn: getPages,
  });

  return { data, isError };
};

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pageData }: { id: number; pageData: PageRequest }) =>
      updatePage(id, pageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
};

export const useUpdateTitle = () => {};

export const useOptimisticUpdatePage = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageData }: { pageData: PageRequest }) =>
      updatePage(id, pageData),
    onMutate: async ({ pageData }: { pageData: PageRequest }) => {
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
      queryClient.invalidateQueries({ queryKey: ["page", id] });
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
};
