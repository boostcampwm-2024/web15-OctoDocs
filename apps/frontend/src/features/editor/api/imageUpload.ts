import { Post } from "@/shared/api/axios";

type UploadImageResponse = {
  message: string;
  url: string;
};

export const onUpload = async (file: File) => {
  const url = `/api/upload/image`;

  const formData = new FormData();
  formData.append(`file`, file);

  const res = await Post<UploadImageResponse, FormData>(url, formData);
  return res.data.url;
};
