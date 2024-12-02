import { createImageUpload } from "novel/plugins";

// TODO: 수정해야할듯
import { onUpload } from "@/features/editor";

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      console.log("File type not supported.");
      return false;
    } else if (file.size / 1024 / 1024 > 20) {
      console.log("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});
