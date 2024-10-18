import { ReactNode } from 'react';
import styles from './heading.module.scss';
import BadgeCustom from '../badge/badge';

type Props = {
    title: string;
    button?: ReactNode;
    status?: string;
    titleStatus?: string;
};

const Heading = ({ title, button, status, titleStatus }: Props) => {
    return (
        <h1 className={styles.heading}>
            {button && button}
            {title}
            <BadgeCustom status={status} title={titleStatus} />
        </h1>
    );
};

export default Heading;
