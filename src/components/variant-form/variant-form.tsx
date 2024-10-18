import { IoIosAddCircleOutline } from 'react-icons/io';
import { FormCombine } from '@prisma/client';

import Button from '../button/button';
import FormControl from '../form-control/form-control';
import styles from './variant-form.module.scss';
import { Dispatch, SetStateAction, useState } from 'react';
import Chip from '@mui/material/Chip';
import { PickUpFormCombines } from '@/types';

type Props = {
    forms?: PickUpFormCombines[];
    setForms?: Dispatch<SetStateAction<PickUpFormCombines[]>>;
    createForm?: (parentId: any) => void;
};

const VariantForm = ({ forms, setForms, createForm }: Props) => {
    const [errors, setErrors] = useState<any>();

    const hanldeRemoveFormElement = (id: any) => {
        setForms!((prev) => {
            const remove = prev.filter((form) => form.date_id !== id);

            return remove;
        });
    };

    const handleChangeTitleField = (date_id: any, field: string, value: string) => {
        const newForms = forms?.map((form) => {
            if (form.date_id === date_id) {
                if (field === 'values') {
                    const valueArray = value.split(',').map((v) => v.toLowerCase().trim());
                    const newValues = [...new Set(valueArray)];

                    return { ...form, values: newValues };
                }
                return { ...form, [field]: value };
            }

            return form;
        });

        setForms!(newForms!);
    };

    const handleEditForm = (formId: any, done: boolean) => {
        const newForms = forms?.map((form) => {
            if (form?.date_id === formId) {
                return { ...form, isDone: done };
            }
            return form;
        });

        setForms!(newForms!);
    };

    const validatedField = (formId: any) => {
        const newErrors: any = { ...errors };

        const form = forms?.find((form) => form.date_id === formId);
        let formIsValid = true;

        if (!form?.title) {
            newErrors![`title-${form?.date_id}`] = 'Bắt buộc phải có tên tùy chọn.';
            formIsValid = false;
        } else {
            delete newErrors![`title-${form?.date_id}`];
        }

        if (form?.values?.length === 0 || form?.values[0] === '') {
            newErrors![`values-${form?.date_id}`] = 'Bắt buộc phải có giá trị tùy chọn.';
            formIsValid = false;
        } else {
            delete newErrors![`values-${form?.date_id}`];
        }

        setErrors(newErrors);

        const newForms = forms?.map((form) => {
            if (form.date_id === formId) {
                return { ...form, isDone: formIsValid };
            } else {
                return { ...form };
            }
        });

        setForms!(newForms!);

        return Object.keys(newErrors).length === 0;
    };

    const handleDone = (formId: any) => {
        validatedField(formId);
    };

    return (
        <div className={styles.wrapper}>
            {forms &&
                forms?.map((form) => {
                    if (form?.isDone) {
                        return (
                            <div
                                onClick={() => handleEditForm(form?.date_id, false)}
                                key={form.date_id}
                                className={styles.variant_item}
                            >
                                <h4>
                                    <strong>{form?.title}</strong>
                                </h4>
                                <div className={styles.variant_item_done}>
                                    {form?.values?.map((value, index) => (
                                        <span key={index}>{value?.toUpperCase()}</span>
                                    ))}
                                </div>
                            </div>
                        );
                    } else
                        return (
                            <div key={form.date_id} className={styles.variant}>
                                <FormControl
                                    onChange={(e) =>
                                        handleChangeTitleField(form?.date_id, e.target.name, e.target.value)
                                    }
                                    label="Tên tùy chọn"
                                    type="text"
                                    placeholder="Cỡ hoặc màu"
                                    name="title"
                                    value={form?.title!}
                                    defaultValue={form?.title!}
                                    onBlur={() => validatedField(form?.date_id)}
                                    errorMessage={errors && errors![`title-${form.date_id}`]}
                                />
                                <div className={styles.variant_value}>
                                    <h4>Giá trị tùy chọn (mỗi giá trị cách nhau bằng dấu &rdquo; , &rdquo;)</h4>
                                    <div style={{ padding: '4px 0' }}>
                                        {form?.values?.map(
                                            (value, index) =>
                                                value && (
                                                    <Chip
                                                        sx={{ marginRight: '4px' }}
                                                        size="small"
                                                        color="info"
                                                        key={index}
                                                        label={value}
                                                    />
                                                ),
                                        )}
                                    </div>
                                    <FormControl
                                        onChange={(e) =>
                                            handleChangeTitleField(form?.date_id, e.target.name, e.target.value)
                                        }
                                        type="text"
                                        name="values"
                                        placeholder="Giá trị"
                                        defaultValue={[...new Set(form?.values)].join(', ')}
                                        value={[...new Set(form?.values)].join(', ')}
                                        onBlur={() => validatedField(form?.date_id)}
                                        errorMessage={errors && errors![`values-${form?.date_id}`]}
                                    />
                                </div>
                                <div className={styles.variant_action}>
                                    <Button
                                        onClick={() => hanldeRemoveFormElement(form?.date_id)}
                                        sx={{ width: 46 }}
                                        variant="remove"
                                        type="button"
                                        activeType="button"
                                    >
                                        Xóa
                                    </Button>
                                    <Button
                                        onClick={() => handleDone(form?.date_id)}
                                        sx={{ width: 'auto' }}
                                        variant="primary"
                                        activeType="button"
                                        type="button"
                                    >
                                        Done (đã xong)
                                    </Button>
                                </div>
                            </div>
                        );
                })}
            <Button
                sx={{ justifyContent: 'left', padding: '12px 16px' }}
                activeType="button"
                placement="left"
                variant="underline"
                type="button"
                icon={IoIosAddCircleOutline}
                onClick={createForm}
            >
                Thêm tùy chọn khác
            </Button>
        </div>
    );
};

export default VariantForm;
