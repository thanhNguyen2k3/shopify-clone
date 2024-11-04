import { db } from '@/lib/db';
import Order from './order';

type Props = {
    params: {
        order_id: string;
    };
};

const OrderExistingPage = async ({ params: { order_id } }: Props) => {
    const data = await db.order.findFirst({
        where: {
            id: order_id,
        },
        include: {
            contact_information: {
                include: {
                    user: true,
                },
            },
            gift_card: true,
            product_variant_for_order: {
                include: {
                    variant: {
                        include: {
                            product: true,
                            image: true,
                        },
                    },
                    product: {
                        include: {
                            category: true,
                            images: {
                                include: {
                                    image: true,
                                },
                            },
                            form_combines: true,
                            variants: {
                                include: {
                                    image: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return <Order data={data! as any} />;
};

export default OrderExistingPage;
