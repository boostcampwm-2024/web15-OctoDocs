import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNode,
  deleteNode,
  updateNode,
  type NodeRequest,
} from "@/api/node";

// export const useNodeCoors = (id: number) => {
//   const { data, isError } = useQuery({
//     queryKey: ["node", id],
//     queryFn: () => getNodeCoors(id),
//   });

//   return { coors:data?.coordinates, isError };
// };

export const useCreateNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, nodeData }: { id: number; nodeData: NodeRequest }) =>
      createNode(id, nodeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
};

export const useDeleteNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; nodeData: NodeRequest }) =>
      deleteNode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
};

export const useUpdateNode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, nodeData }: { id: number; nodeData: NodeRequest }) =>
      updateNode(id, nodeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages"] });
    },
  });
};
