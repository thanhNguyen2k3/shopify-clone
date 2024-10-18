'use client';

import styles from './register.module.scss';
import FormControl from '@/components/form-control/form-control';
import Button from '@/components/button/button';
import { SyntheticEvent, useState, useTransition } from 'react';
import { register } from '@/actions/auth';
import ErrorMessage from '@/components/error-message/error-message';

const RegisterPage = () => {
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [flaternError, setFlaternError] = useState<{
        username?: string[] | undefined;
        email?: string[] | undefined;
        password?: string[] | undefined;
    }>();

    const onSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        startTransition(() => {
            register({ email, password, username }!).then((data) => {
                setErrorMessage(data?.message!);
                setFlaternError(data?.errors);
            });
        });
    };

    return (
        <div className={styles.layout}>
            <div className={styles.wrapper}>
                <h1 className={styles.heading}>Đăng ký</h1>
                <form onSubmit={onSubmit} className={styles.form}>
                    {errorMessage && <ErrorMessage message={errorMessage!} />}
                    <FormControl
                        disabled={isPending}
                        onChange={(e) => setUsername(e.target.value)}
                        name="username"
                        type="text"
                        placeholder="abc..."
                        label="Tên đăng nhập"
                        errorMessage={flaternError?.username}
                        style={{ height: 40 }}
                    />
                    <FormControl
                        disabled={isPending}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        label="Địa chỉ email"
                        errorMessage={flaternError?.email}
                        style={{ height: 40 }}
                    />
                    <FormControl
                        disabled={isPending}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        type="password"
                        placeholder="..."
                        label="Mật khẩu"
                        errorMessage={flaternError?.password}
                        style={{ height: 40 }}
                    />
                    <Button
                        type="submit"
                        disabled={isPending}
                        variant={isPending ? 'disabled' : 'primary'}
                        activeType="button"
                        sx={{ width: '100%', height: 44 }}
                    >
                        {isPending ? 'Đang xử lý...' : 'Tạo tài khoản'}
                    </Button>
                </form>

                <p>
                    Bạn đã có tài khoản rồi?
                    <Button sx={{ padding: '0 2px' }} activeType="link" href="/login" variant="underline">
                        Đăng nhập
                    </Button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
