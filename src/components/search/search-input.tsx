import { ForwardedRef, forwardRef, HTMLProps, InputHTMLAttributes, LegacyRef, Ref } from 'react';
import { IoSearch } from 'react-icons/io5';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CgSpinnerTwo } from 'react-icons/cg';

import styles from './search-input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

type Props = InputProps & {
    loading?: boolean;
    handleClear?: () => void;
};

// eslint-disable-next-line react/display-name
const SearchInput = ({ handleClear, loading, style: sx, value, ...props }: Props) => {
    return (
        <div style={sx} className={styles.search_box_input}>
            <span>
                <IoSearch color="#8a8a8a" size={18} />
            </span>
            <input {...props} value={value} type="text" placeholder="Tìm kiếm tất cả sản phẩm" />
            {loading && value && (
                <span className={styles.loading}>
                    <CgSpinnerTwo size={18} />
                </span>
            )}
            <span onClick={handleClear} className={styles.clear}>
                <AiOutlineCloseCircle size={18} />
            </span>
        </div>
    );
};

export default SearchInput;
