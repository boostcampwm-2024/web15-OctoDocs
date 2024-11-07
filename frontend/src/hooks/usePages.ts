import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPages,
  createPage,
  deletePage,
  updatePage,
  type PageRequest,
} from "@/api/page";
import { JSONContent } from "novel";

export const usePages = () => {
  const { data, isError } = useQuery({
    queryKey: ["pages"],
    queryFn: getPages,
  });

  return { data, isError };
};

export const useCreatePage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pageData }: { id: number; pageData: PageRequest }) =>
      createPage(id, pageData),
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

export const useUpdatePage = () => {
  return useMutation({
    mutationFn: ({ id, pageData }: { id: number; pageData: JSONContent }) =>
      updatePage(id, pageData),
  });
};
