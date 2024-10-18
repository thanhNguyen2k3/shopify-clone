import * as z from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .email({
            message: 'Email là bắt buộc',
        })
        .trim(),
    password: z.string().min(1, { message: 'Mật khẩu là bắt buộc' }).trim(),
});

export const registerSchema = z.object({
    username: z
        .string({ message: 'Tên đăng nhập không được bỏ trống' })
        .min(3, { message: 'Tên đăng nhập tối thiểu 3 kí tự' })
        .trim(),
    email: z
        .string()
        .email({
            message: 'Email là bắt buộc',
        })
        .trim(),
    password: z.string({ message: 'Mật khẩu là bắt buộc' }).min(3, { message: 'Tối thiểu 3 kí tự' }).trim(),
});
