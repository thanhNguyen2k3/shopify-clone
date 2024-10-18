import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, SyntheticEvent, useRef, useState } from 'react';
import { Image as ImageType } from '@prisma/client';
import { IoMdClose } from 'react-icons/io';
import { IoGrid } from 'react-icons/io5';
import { FaListUl } from 'react-icons/fa';
import { LuArrowDownUp } from 'react-icons/lu';
import Alert from '@mui/material/Alert';
import Image from 'next/image';

import AnimationModal from '../animation/modal/animation-modal';
import styles from './modal-upload.module.scss';
import SearchInput from '../search/search-input';
import PopperArrange from '../popper/popper-arrange';
import PopperFilter from '../popper/popper-filter';
import Loading from '../animation/loading/loader';
import { restApi } from '@/configs/axios';
import Button from '../button/button';
import Checkbox from '../checkbox/checkbox';
import Loader from '../animation/loading/loader';

type Props = {
    modalState: boolean;
    modalDispatch: Dispatch<SetStateAction<boolean>>;
    fileStates?: ImageType[];
    fileDispath?: Dispatch<SetStateAction<ImageType[]>>;
    onSelected?: (...props: any) => void;
    checkboxType?: 'radio' | 'checkbox';
};

const ModalUpload = ({ modalState, modalDispatch, fileStates, fileDispath, onSelected, checkboxType }: Props) => {
    const labels = [
        {
            id: 'arrang_day_new',
            title: 'Ngày thêm (mới nhất trước)',
            type: 'radio',
        },
        {
            id: 'arrang_day_old',
            title: 'Ngày thêm (cũ nhất trước)',
            type: 'radio',
        },
        {
            id: 'arrang_file_name_a_z',
            title: 'Tên tệp (A-Z)',
            type: 'radio',
        },
        {
            id: 'arrang_file_name_z_a',
            title: 'Tên tệp (Z-A)',
            type: 'radio',
        },
        {
            id: 'arrang_size_less',
            title: 'Kích cỡ tệp (nhỏ nhất trước)',
            type: 'radio',
        },
        {
            id: 'arrang_size_large',
            title: 'Kích cỡ tệp (lớn nhất trước)',
            type: 'radio',
        },
    ];

    const view_types = [
        {
            id: 'list',
            title: 'Xem dưới dạng danh sách',
            icon: FaListUl || null,
        },
        {
            id: 'grid',
            title: 'Xem dưới dạng lưới',
            icon: IoGrid || null,
        },
    ];

    const type_files = [
        {
            id: 'images',
            title: 'Hình ảnh',
        },
        {
            id: 'video',
            title: 'Video',
        },
        {
            id: '3d',
            title: 'Mô hình 3D',
        },
    ];

    // state
    const [typeFiles, setTypeFiles] = useState<string[]>([]);
    const [searchFileValue, setSearchFileValue] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<{ message: string; status: number } | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    // Tanstack query

    const queryClient = useQueryClient();

    const handleUploadFiles = async (e: SyntheticEvent) => {
        const files = (e.target as HTMLInputElement).files;

        for (const file of files!) {
            const formData = new FormData();
            formData.append('file', file);

            const { data, status } = await restApi.post('/api/uploads', formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                },
            });

            setMessage({ message: data.message, status });

            setTimeout(() => {
                setMessage(null);
            }, 3000);
        }
    };

    const { mutate: unlinkMutate, isPending } = useMutation({
        mutationFn: async () => {
            const fileNames = fileStates?.map((item) => item.name);

            await restApi.post(`/api/uploads/unlink`, {
                ids: fileNames,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['images'] });
            fileDispath!([]);
        },
    });

    const { mutate: uploadMutate, isPending: isPendingUpload } = useMutation({
        mutationFn: handleUploadFiles,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['images'] });
        },
    });

    const { data, isLoading } = useQuery<{ data: ImageType[] }>({
        queryKey: ['images'],
        queryFn: async () => {
            const { data } = await restApi.get('/api/uploads');

            return data;
        },
    });

    const isChecked = (id: string) => {
        return fileStates?.some((item) => item?.id === id);
    };

    // handleSearchForm

    const handleSearchFileValue = (e: SyntheticEvent) => {
        const value = (e.target as HTMLInputElement).value;
        if (!value.startsWith(' ')) {
            setSearchFileValue(value);
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const handleClear = () => {
        setSearchFileValue('');
        inputRef.current?.focus();
    };

    // Handle modal

    const onHideModal = () => {
        modalDispatch(false);
    };

    const handleDone = () => {
        fileDispath!(fileStates!);

        modalDispatch(false);
    };

    return (
        <AnimationModal isState={modalState} setIsState={modalDispatch}>
            {message &&
                (message.status !== 200 ? (
                    <Alert severity={'error'}>{message.message}.</Alert>
                ) : (
                    <Alert severity={'success'}>{message.message}.</Alert>
                ))}
            <div className={styles.modal_box}>
                {isPendingUpload && <Loader style={{ position: 'absolute', opacity: 0.4 }} />}
                <div className={styles.header}>
                    <h2>Chọn tệp</h2>
                    <Button
                        onClick={onHideModal}
                        size={28}
                        placement="left"
                        icon={IoMdClose}
                        activeType="button"
                        sx={{ width: 28, height: 28, columnGap: 0 }}
                        variant="defaulted"
                    />
                </div>
                <div className={styles.body}>
                    <div className={styles.body_action}>
                        <SearchInput
                            value={searchFileValue}
                            loading={loading}
                            handleClear={handleClear}
                            onChange={handleSearchFileValue}
                            placeholder="Tìm kiếm tệp"
                            name="search_file"
                            id="search_file"
                            style={{ width: 250, height: 32, borderColor: '#8a8a8a' }}
                        />
                        <div className={styles.arrange}>
                            <PopperArrange icon={LuArrowDownUp} text="Sắp xếp" labels={labels} />
                            <PopperArrange icon={FaListUl} arrow type="view" labels={view_types} />
                        </div>
                    </div>
                    <div className={styles.body_action}>
                        <PopperFilter title="Loại tệp" state={typeFiles} setState={setTypeFiles} data={type_files} />
                    </div>
                    <div style={{ marginTop: 16, position: 'relative' }} className={styles.wrapper}>
                        <input
                            type="file"
                            onChange={(e) => {
                                uploadMutate(e);
                            }}
                            multiple
                            className={styles.input_file}
                        />
                        <div className={styles.box}>
                            <Button activeType="button" sx={{ color: '#000' }} variant="custom">
                                Thêm phương tiện
                            </Button>
                            <p>Chấp nhận hình ảnh, video hoặc mô hình 3D</p>
                        </div>
                    </div>
                    <div style={{ padding: '12px 0' }}>
                        <div className={styles.box_images}>
                            {isLoading ? (
                                <Loading />
                            ) : (
                                data &&
                                data?.data?.map((item) => (
                                    <div key={item.id} className={styles.box_images_item}>
                                        <div className={styles.inner_box}>
                                            <Checkbox
                                                style={{ position: 'absolute', top: 0, left: 0 }}
                                                checked={isChecked(item.id)}
                                                onChange={(e) => {
                                                    onSelected!(e.target.checked, item);
                                                }}
                                                checkboxType={checkboxType}
                                            >
                                                <Image
                                                    unoptimized
                                                    src={item.url}
                                                    width={100}
                                                    height={100}
                                                    alt="image"
                                                />
                                            </Checkbox>
                                        </div>
                                        <p>{item.name}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    {fileStates?.length! > 0 && (
                        <div onClick={() => unlinkMutate()} className={styles.unlink}>
                            {isPending ? 'Đang xóa ...' : 'Xóa mục đã chọn'}
                        </div>
                    )}
                    <Button onClick={onHideModal} activeType="button" variant="custom" sx={{ height: 28 }}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleDone}
                        activeType="button"
                        variant={fileStates?.length! > 0 ? 'primary' : 'disabled'}
                        sx={{ height: 28 }}
                    >
                        Xong
                    </Button>
                </div>
            </div>
        </AnimationModal>
    );
};

export default ModalUpload;
