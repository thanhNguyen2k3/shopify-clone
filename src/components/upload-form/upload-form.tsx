import { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import Image from 'next/image';
import { Image as ImageType } from '@prisma/client';

import Button from '../button/button';
import styles from './upload-form.module.scss';
import ModalUpload from '../modal/modal-upload';

type Props = {
    images?: ImageType[];
    setImages?: Dispatch<SetStateAction<ImageType[]>>;
    typeToUpload?: any | 'checkbox';
};

const UploadForm = ({ setImages, images, typeToUpload }: Props) => {
    const [showModalUpload, setShowModalUpload] = useState<boolean>(false);
    const [fileIds, setFileIds] = useState<ImageType[]>(images! || []);

    useEffect(() => {
        const imageIds = fileIds.map((item) => item);

        setImages!(imageIds);
    }, [fileIds, setImages]);

    const onShowModal = () => {
        setShowModalUpload(true);
    };

    // Upload

    const handleSelected = (checked: boolean, src: ImageType) => {
        if (!showModalUpload) {
            setFileIds([]);
        }

        if (checked) {
            setFileIds((prev) => [...prev, { ...src }]);
        } else {
            setFileIds((prev) => prev.filter((item) => item.name !== src.name));
        }
    };

    return (
        <div>
            <div className={styles.wrapper}>
                {fileIds?.length > 0 ? (
                    <div className={styles.grid_images}>
                        {fileIds?.map((item, index) => (
                            <div key={index} className={styles.grid_images_item}>
                                <Image unoptimized src={item?.url!} width={110} height={110} alt="image" />
                            </div>
                        ))}
                        <div
                            className={`${styles.grid_images_item} ${styles.grid_images_adding}`}
                            onClick={onShowModal}
                        >
                            <IoMdAdd size={20} />
                        </div>
                    </div>
                ) : (
                    <div className={styles.box} onClick={onShowModal}>
                        <Button activeType="button" type="button" sx={{ color: '#000' }} variant="custom">
                            Chọn tệp hiện có
                        </Button>
                        <p>Chấp nhận hình ảnh, video hoặc mô hình 3D</p>
                    </div>
                )}
            </div>

            <ModalUpload
                modalState={showModalUpload}
                modalDispatch={setShowModalUpload}
                fileStates={fileIds}
                fileDispath={setFileIds}
                onSelected={handleSelected}
                checkboxType={typeToUpload || 'checkbox'}
            />
        </div>
    );
};

export default UploadForm;
