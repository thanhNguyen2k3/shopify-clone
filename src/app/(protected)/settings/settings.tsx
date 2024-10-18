import { Session } from 'next-auth';

import styles from './settings.module.scss';
import Heading from '@/components/haeding/heading';
import BackButton from '@/components/back-button/back-button';
import Button from '@/components/button/button';
import { signOut } from '@/auth';

type Props = {
    session?: Session | null;
};

const Settings = ({ session }: Props) => {
    return (
        <div className={styles.wrapper}>
            <Heading button={<BackButton />} title="Cài đặt" />

            <div className={styles.box}>
                <div className={styles.info}>
                    <p>Welcom, {session?.user.username}</p>

                    <Button sx={{ padding: 0 }} activeType="link" variant="underline" href="/products/new">
                        Thêm mới sản phẩm nào ! 💚
                    </Button>
                </div>

                <form
                    action={async () => {
                        'use server';
                        await signOut();
                    }}
                >
                    <Button sx={{ marginTop: 12 }} activeType="button" type="submit" variant="primary">
                        Đăng xuất
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
