import styles from './checkbox.module.scss';

import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
    title?: string;
    sub_title?: string;
    checkboxType?: 'radio' | 'checkbox';
};

const Checkbox = ({ title, sub_title, style, children, checkboxType, ...props }: Props) => {
    return (
        <label htmlFor={props.name} className={styles.content}>
            <div className={styles.checkbox} style={style}>
                {checkboxType === 'radio' && <input type={'radio'} name="radio" {...props} />}
                {checkboxType === 'checkbox' && <input type={'checkbox'} {...props} />}

                <div className={styles.transition}></div>
            </div>
            {title && (
                <div className={styles.title}>
                    <span>{title}</span>
                    {sub_title && <p>{sub_title}</p>}
                </div>
            )}
            {children}
        </label>
    );
};

export default Checkbox;
