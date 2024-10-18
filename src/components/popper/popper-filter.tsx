import TippyCustom from '@/tippy/tippy-custom';
import { IoChevronDownOutline } from 'react-icons/io5';

import Button from '../button/button';
import styles from './popper-filter.module.scss';
import { MdCheck } from 'react-icons/md';
import { Dispatch, SetStateAction } from 'react';
import Checkbox from '../checkbox/checkbox';

type Props = {
    title?: string;
    state?: any[];
    data: any[];
    setState?: Dispatch<SetStateAction<any[]>>;
};

const PopperFilter = ({ title, data, setState, state }: Props) => {
    const isChecked = (value: number | string) => state?.includes(value);
    const handleSelected = (id: number | string) => {
        setState!((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    return (
        <TippyCustom
            trigger="click"
            placement="bottom-start"
            offset={[0, 4]}
            interactive
            render={(attrs) => (
                <div className={styles.wrapper} {...attrs}>
                    {data &&
                        data?.map((item) => (
                            <Checkbox
                                type="checkbox"
                                key={item.id}
                                onChange={() => handleSelected(item.id)}
                                title={item.title}
                                checkboxType="checkbox"
                            />
                        ))}

                    <button className={styles.button}>Xóa</button>
                </div>
            )}
        >
            <Button activeType="button" variant="dash" placement="right" icon={IoChevronDownOutline}>
                {title}
            </Button>
        </TippyCustom>
    );
};

export default PopperFilter;
