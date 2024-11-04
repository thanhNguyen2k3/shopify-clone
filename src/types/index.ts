import {
    Category,
    ContactInformation,
    FormCombine,
    GiftCard,
    Image,
    ImagesForProducts,
    Order,
    Product,
    User,
    Variant,
    VariantProductForOrder,
} from '@prisma/client';
import { ReactNode } from 'react';

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

export type ExtandOrder = Order & {
    contact_information: ContactInformation & {
        user: User;
    };
    gift_card: GiftCard | null;
    product_variant_for_order: ExtandVariantProductForOrder[];
};

export type ExtandVariantProductForOrder = VariantProductForOrder & {
    variant: ExtandVariant | null;
    product: ExtandDataProps | null;
};

// Table props

export type TableRows = {
    id: string;
    label?: ReactNode;
};
