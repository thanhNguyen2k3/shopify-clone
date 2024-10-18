import { BiImageAdd } from 'react-icons/bi';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { Image as ImageType } from '@prisma/client';
import Image from 'next/image';

import styles from './variant-item.module.scss';
import FormControl from '../form-control/form-control';
import ModalUpload from '../modal/modal-upload';
import NumericFormat from '../numeric-format/numeric-format';
import { ExtandVariant } from '@/types';

type Props = {
    variant?: ExtandVariant;
    state?: any[];
    setState?: Dispatch<SetStateAction<any[]>>;
    variantId: any;
};

const VariantItem = ({ variant, setState, state, variantId }: Props) => {
    const [modalState, setModalState] = useState<boolean>(false);

    useEffect(() => {
        setState!(state!);
    }, [state, setState]);

    // Handle modal
    const onShowModal = () => {
        setModalState(true);
    };

    // Handle variant

    const handleChange = (id: any, field: string, value: string) => {
        const newVariantValues = state?.map((item, index) => {
            if (index === id) {
                return {
                    ...item,
                    [field]: value,
                };
            }

            return item;
        });

        setState!(newVariantValues!);

        return newVariantValues;
    };

    const onSelectedImageForAVariant = (checked: boolean, src: ImageType) => {
        if (checked) {
            const newVariantValues = state?.map((item, index) => {
                if (index === variantId) {
                    return {
                        ...item,
                        image: src,
                    };
                }

                return item;
            });

            setState!(newVariantValues!);
        }
    };

    return (
        <Fragment>
            <div className={`${styles.body} ${styles.box} `}>
                <div className={styles.col_span_5} onClick={onShowModal}>
                    <div>
                        <div className={`${styles.image}  ${styles.img_60}`}>
                            {variant?.image ? (
                                <Image unoptimized src={variant.image.url} width={60} height={60} alt="image" />
                            ) : (
                                <BiImageAdd />
                            )}
                        </div>
                        <div className={styles.description}>
                            <p>{variant?.combinations?.join(' - ').toLocaleUpperCase()}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.col_span_2}>
                    <FormControl format min={0} name="price" id="price">
                        <NumericFormat
                            value={variant?.price}
                            suffix=" đ"
                            name="price"
                            onChange={(e) => handleChange(variantId, e.target.name, e.target.value)}
                        />
                    </FormControl>
                </div>
                <div className={styles.col_span_1}>
                    <FormControl format>
                        <NumericFormat
                            value={variant?.available}
                            suffix=" sl"
                            name="available"
                            onChange={(e) => handleChange(variantId, e.target.name, e.target.value)}
                        />
                    </FormControl>
                </div>
            </div>

            <ModalUpload
                onSelected={onSelectedImageForAVariant}
                modalState={modalState}
                modalDispatch={setModalState}
                checkboxType="radio"
            />
        </Fragment>
    );
};

export default VariantItem;
