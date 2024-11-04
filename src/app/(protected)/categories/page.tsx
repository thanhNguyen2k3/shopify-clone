import Button from '@/components/button/button';
import CategoriesTable from './categories';
import styles from './categories.module.scss';
import Heading from '@/components/haeding/heading';

const CategoriesPage = () => {
    return (
        <div>
            <div className={styles.wrapper_header}>
                <Heading title="Danh mục" />
                <Button activeType="link" to="categories/new" variant="primary">
                    Thêm danh mục
                </Button>
            </div>

            <CategoriesTable />
        </div>
    );
};

export default CategoriesPage;
