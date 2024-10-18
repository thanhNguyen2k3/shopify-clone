import { ReactNode } from 'react';

import styles from './layout.module.scss';

type Props = {
    children: ReactNode;
};

const AuthLayout = (props: Props) => {
    return <div className={styles.banner}>{props.children}</div>;
};

export default AuthLayout;
