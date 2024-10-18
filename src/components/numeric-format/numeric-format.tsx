import { NumericFormat as NumericFormatComponent, NumericFormatProps } from 'react-number-format';

import styles from './numeric-format.module.scss';

type Props = NumericFormatProps & {};

const NumericFormat = ({ ...props }: Props) => {
    return (
        <NumericFormatComponent
            allowLeadingZeros
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={0}
            allowNegative={false}
            className={styles.input}
            {...props}
        />
    );
};

export default NumericFormat;
