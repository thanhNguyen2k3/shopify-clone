import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Detail from './detail';

type Props = {
    params: {
        id: string;
    };
};

const Page = async ({ params: { id } }: Props) => {
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
            form_combines: true,
        },
    });

    if (!id || !data) {
        return notFound();
    }

    return <Detail data={data!} />;
};

export default Page;
