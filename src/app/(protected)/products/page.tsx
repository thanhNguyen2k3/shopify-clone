import ProductTable from '@/app/client/products/products-table';
import Button from '@/components/button/button';
import Heading from '@/components/haeding/heading';
import styles from './products.module.scss';

type Props = {};

const Product = (props: Props) => {
    return (
        <div>
            <div className={styles.wrapper_header}>
                <Heading title="Sản phẩm" />
                <Button activeType="link" to="products/new" variant="primary">
                    Thêm sản phẩm
                </Button>
            </div>

            <ProductTable />
        </div>
    );
};

export default Product;
