import { z } from 'zod';

export const productSchema = z.object({
    title: z.string({ message: 'Không được bỏ trống tiêu đề' }).min(3, { message: 'Tiêu đề dài hơn 3 ký tự' }).trim(),
    category_id: z
        .string({ message: 'Không được bỏ trống danh mục' })
        .min(1, { message: 'Không được bỏ trống danh mục' })
        .trim(),
});

export type ProductFormState =
    | {
          errors?: {
              title?: string[];
              category_id?: string[];
          };
      }
    | undefined;
