import UpdateProductForm from '@/app/client/products/update-product-form';
import { db } from '@/lib/db';
import { ExtandDataProps } from '@/types';

type ParamsProps = {
    params: {
        product_id: string;
    };
};

const getData = async (id: string) => {
    const data = await db.product.findFirst({
        where: {
            id,
        },
        include: {
            category: {
                include: {
                    image: true,
                },
            },
            form_combines: true,
            images: {
                include: {
                    image: true,
                },
            },
            variants: {
                include: {
                    image: true,
                },
            },
        },
    });

    return data;
};

const getCategoryData = async () => {
    const data = await db.category.findMany({
        include: {
            image: true,
        },
    });
    return data;
};

const Page = async ({ params: { product_id } }: ParamsProps) => {
    const existingData = await getData(product_id);
    const categories = await getCategoryData();

    return (
        <div style={{ width: 966, margin: '0 auto', maxWidth: '100%' }}>
            <UpdateProductForm existingData={existingData!} categories={categories!} />
        </div>
    );
};

export default Page;
