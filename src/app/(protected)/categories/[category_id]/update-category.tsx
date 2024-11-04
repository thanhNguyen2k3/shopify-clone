'use client';

import { FormEvent, Fragment, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Image as ImageType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { CiWarning } from 'react-icons/ci';
import Image from 'next/image';

import styles from '../new/new-categories.module.scss';
import Heading from '@/components/haeding/heading';
import BackButton from '@/components/back-button/back-button';
import Button from '@/components/button/button';
import FormControl from '@/components/form-control/form-control';
import { restApi } from '@/configs/axios';
import ModalUpload from '@/components/modal/modal-upload';
import ToastMessage from '@/components/animation/toast-message/toast-message';
import { ExtandCategory } from '@/types';

type Props = {
    data: ExtandCategory | null;
};

const NewCategory = ({ data: existingData }: Props) => {
    // router
    const router = useRouter();
    // state

    const [title, setTitle] = useState<string>('');
    const [image, setImage] = useState<ImageType | null>(null);
    const [modalState, setModalState] = useState<boolean>(false);

    useEffect(() => {
        setTitle(existingData?.title!);
        setImage(existingData?.image!);
    }, [existingData]);

    const onModal = () => {
        setModalState(true);
    };

    const { mutate, isPending, data } = useMutation({
        mutationFn: async (data: any) => {
            const response = await restApi.put(`/api/category/${existingData?.id}`, {
                ...data,
            });

            return response.data;
        },
        onError: (error) => {
            console.log('ERROR', error);
        },
        onSuccess: () => {
            router.refresh();
        },
    });

    const onSelectedImageForACategory = (checked: boolean, src: ImageType) => {
        if (checked) {
            setImage!(src);
        }
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        const data = {
            title,
            image_id: image?.id || null,
        };

        mutate(data);
    };

    return (
        <Fragment>
            <Heading title={`Danh mục: ${existingData?.title}`} button={<BackButton />} />

            {data?.message && <ToastMessage isStatus={'success'} message={data?.success} />}

            <form onSubmit={onSubmit}>
                <div className={styles.wrapper_new_form}>
                    <div className={styles.wrapper_form} style={{ minWidth: '51%', flex: '2 2 30rem' }}>
                        <div className={styles.wrapper}>
                            <FormControl
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                label="Tên danh mục"
                                name="title"
                                id="title"
                                placeholder="Áo..."
                                errorMessage={data?.error}
                                defaultValue={existingData?.title}
                            />

                            <FormControl label="Phương tiện" name="images" id="images" uploadForm>
                                <div style={{ position: 'relative' }}>
                                    {image && (
                                        <Image
                                            style={{ display: 'block' }}
                                            src={image.url}
                                            unoptimized
                                            alt="image"
                                            width={200}
                                            height={200}
                                        />
                                    )}

                                    {image && (
                                        <span
                                            onClick={() => setImage(null)}
                                            style={{
                                                position: 'absolute',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Clear
                                        </span>
                                    )}
                                </div>

                                <Button
                                    activeType="button"
                                    sx={{ marginTop: '24px' }}
                                    onClick={onModal}
                                    type="button"
                                    variant="secondary"
                                >
                                    Thêm ảnh
                                </Button>
                            </FormControl>
                        </div>
                    </div>
                </div>

                {/* Modal upload image */}

                <ModalUpload
                    onSelected={onSelectedImageForACategory}
                    modalState={modalState}
                    modalDispatch={setModalState}
                    checkboxType="radio"
                />

                {/* Save */}

                <div className={styles.save}>
                    <div className={styles.save_wrapper}>
                        <div className={`${styles.save_box} ${styles.save_warning}`}>
                            <CiWarning /> <span>Danh mục chưa được lưu</span>
                        </div>
                        <div className={styles.save_box}>
                            <Button
                                type="button"
                                activeType="button"
                                variant="secondary"
                                sx={{ backgroundColor: '#404040', color: '#e3e3e3' }}
                                onClick={() => {
                                    if (window.confirm('Sản phẩm chưa được lưu, Bạn có muốn hủy bỏ?')) router.back();
                                }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button type="submit" activeType="button" variant={'secondary'}>
                                {isPending ? 'Đang gửi...' : 'Lưu'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Fragment>
    );
};

export default NewCategory;
