import { Category, FormCombine, Image, ImagesForProducts, Product, Variant } from '@prisma/client';

export type PickUpFormCombines = Pick<FormCombine, 'date_id' | 'isDone' | 'title' | 'values'>;

export type ExtandCategory = Category & {
    image: Image | null;
};

export type ExtandImagesForProducts = ImagesForProducts & {
    image: Image | null;
};

export type ExtandDataProps = Product & {
    category: ExtandCategory | null;
    images: ExtandImagesForProducts[] | null;
    variants: ExtandVariant[] | null;
    form_combines: FormCombine[] | null;
};

export type ExtandVariant = Variant & {
    image: Image | null;
};
