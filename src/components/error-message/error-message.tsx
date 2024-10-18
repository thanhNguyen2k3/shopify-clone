import { CiWarning } from 'react-icons/ci';

import styles from './error-message.module.scss';

type Props = {
    message: string;
};

const ErrorMEssage = ({ message }: Props) => {
    return (
        <div className={styles.message}>
            <CiWarning />
            {message}
        </div>
    );
};

export default ErrorMEssage;
