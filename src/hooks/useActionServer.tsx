import { useState, useTransition } from 'react';

type Props = {
    promise: (data: any) => Promise<{
        message?: string;
        data: any;
        errors?: any[];
        success: boolean;
    }>;
    sendData: {};
};

export const useActionServer = ({ promise }: Props) => {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(true);
    const [errors, setErrors] = useState<any[]>([]);
    const [data, setData] = useState();

    const onSubmit = (send: any) => {
        startTransition(async () => {
            await promise(send).then((res) => {
                setData(res.data);
                setSuccess(res.success);
                setMessage(res.message!);
                setErrors(res?.errors!);
            });
        });
    };

    return {
        onSubmit,
        isPending,
        message,
        success,
        errors,
        data,
    };
};
