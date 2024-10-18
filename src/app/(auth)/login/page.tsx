'use client';

import { useSearchParams } from 'next/navigation';

import styles from './login.module.scss';
import FormControl from '@/components/form-control/form-control';
import Button from '@/components/button/button';
import { SyntheticEvent, useState, useTransition } from 'react';
import { login } from '@/actions/auth';
import ErrorMessage from '@/components/error-message/error-message';

const LoginPage = () => {
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        startTransition(() => {
            login({ email, password }).then((data) => {
                setErrorMessage(data?.errors!);
            });
        });
    };

    return (
        <div className={styles.layout}>
            <div className={styles.wrapper}>
                <h1 className={styles.heading}>Đăng nhập</h1>
                <form onSubmit={onSubmit} className={styles.form}>
                    {errorMessage && <ErrorMessage message={errorMessage!} />}

                    <FormControl
                        disabled={isPending}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        label="Địa chỉ email"
                        style={{ height: 40 }}
                    />
                    <FormControl
                        disabled={isPending}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        type="password"
                        placeholder="..."
                        label="Mật khẩu"
                        style={{ height: 40 }}
                    />
                    <Button
                        type="submit"
                        disabled={isPending}
                        variant={isPending ? 'disabled' : 'primary'}
                        activeType="button"
                        sx={{ width: '100%', height: '44px' }}
                    >
                        {isPending ? 'Đang xử lý...' : 'Đăng nhập'}
                    </Button>
                </form>

                <p>
                    Bạn đã chưa tài khoản?
                    <Button sx={{ padding: '0 2px' }} activeType="link" href="/register" variant="underline">
                        Đăng ký
                    </Button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
