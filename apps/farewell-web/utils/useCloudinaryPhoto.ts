import axios from "axios";
import { mutate } from "swr";
import shallow from "zustand/shallow";
import useSWR from "swr";
import { ImageFile, ImageApiFile } from "@/types/image";

const useCloudinaryPhoto = (file?: {
  blurDataUrl?: string;
  id: string | number;
}) => {
  return useSWR(
    file ? `/farewell/api/images/get?fileId=${file.id}` : null,
    async (url) => {
      const { data } = await axios.get<ImageApiFile>(url);
      if (data) {
        mutate(
          "/images",
          (images: ImageFile[]) => {
            const existing = images
              ? images.findIndex((v) => v.public_id === data.public_id)
              : -1;
            if (existing !== -1) {
              if (shallow(images[existing], data)) return images;
              images[existing] = { ...images[existing], ...data };
            }
            if (!images) {
              images = [];
            }
            images.push({
              ...data,
              id: images.length,
              blurDataUrl: file?.blurDataUrl,
            });
            return images;
          },
          {
            revalidate: false,
          }
        );
      }
      return data;
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );
};

export default useCloudinaryPhoto;
