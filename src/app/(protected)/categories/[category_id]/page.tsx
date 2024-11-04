import { db } from '@/lib/db';
import UpdateCategory from './update-category';

type Props = {
    params: {
        category_id: string;
    };
};

const CategoriesIdPage = async ({ params: { category_id } }: Props) => {
    const data = await db.category.findFirst({ where: { id: category_id }, include: { image: true } });

    return <UpdateCategory data={data!} />;
};

export default CategoriesIdPage;
