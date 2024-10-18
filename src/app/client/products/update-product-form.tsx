'use client';

import { Dispatch, FormEvent, Fragment, memo, SetStateAction, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GrPowerReset } from 'react-icons/gr';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { CiWarning } from 'react-icons/ci';
import Chip from '@mui/material/Chip';
import { Image } from '@prisma/client';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

import styles from './new-product.module.scss';
import Checkbox from '@/components/checkbox/checkbox';
import FormControl from '@/components/form-control/form-control';
import UploadForm from '@/components/upload-form/upload-form';
import Button from '@/components/button/button';
import VariantForm from '@/components/variant-form/variant-form';
import VariantItem from '@/components/variant-form/variant-item';
import NumericFormat from '@/components/numeric-format/numeric-format';
import { useResponsive } from '@/hooks/useResponsive';
import { provinces } from '@/const';
import TextEditor from '@/components/text-editor/text-editor';
import { restApi } from '@/configs/axios';
import Heading from '@/components/haeding/heading';
import BackButton from '@/components/back-button/back-button';
import { ExtandCategory, ExtandDataProps, PickUpFormCombines } from '@/types';
import ToastMessage from '@/components/animation/toast-message/toast-message';

type Props = {
    existingData?: ExtandDataProps | null;
    categories?: ExtandCategory[];
};

const UpdateProductForm = memo(function UpdateProductForm({ existingData, categories }: Props) {
    const queryClient = useQueryClient();

    const activates = [
        {
            id: 'active',
            title: 'Đang hoạt động',
            value: 'true',
        },
        {
            id: 'inActive',
            title: 'Đơn hàng nháp',
            value: 'false',
        },
    ];

    const router = useRouter();

    // Query params data

    // Responsive
    const breakpoints = useResponsive([430, 800, 1024]);

    // State

    const [title, setTitle] = useState<string>(existingData?.title!);
    const [description, setDescription] = useState<string>(existingData?.description!);
    const [categoryValue, setCategoryValue] = useState<string>(existingData?.category_id!);
    const [price, setPrice] = useState<string>(existingData?.price!);
    const [core, setCore] = useState<string>(existingData?.core!);
    const [activeValue, setActivateValue] = useState<string>(existingData?.activate!);
    const [variantValues, setVariantValues] = useState<any[]>([]);
    const [origin, setOrigin] = useState<string>(existingData?.region_of_origin!);
    const [imagesForOnes, setImagesForOnes] = useState<Image[]>(existingData?.images?.map((item) => item?.image!)!);
    const [quantityTracking, setQuantityTracking] = useState<boolean>(existingData?.quantity_tracking!);
    const [inventory, setInventory] = useState<number>(existingData?.inventory!);
    const [continueSelling, setContinueSelling] = useState<boolean>(existingData?.continue_selling!);
    const [productType, setProductType] = useState<string>(existingData?.product_type!);
    const [supplier, setSupplier] = useState<string>(existingData?.supplies!);
    const [tags, setTags] = useState<string[]>(existingData?.tags!);
    const [forms, setForms] = useState<PickUpFormCombines[]>([]);

    // Invalid field
    const [invalidField, setInvalidField] = useState<string | null>(null);

    // Update data effect

    useEffect(() => {
        setTitle(existingData?.title!);
        setDescription(existingData?.description!);
        setCategoryValue(existingData?.category_id!);
        setPrice(existingData?.price!);
        setCore(existingData?.core!);
        setActivateValue(existingData?.activate!);

        setOrigin(existingData?.region_of_origin!);
        setImagesForOnes(existingData?.images?.map((item) => item?.image!)!);
        setQuantityTracking(existingData?.quantity_tracking!);
        setInventory(existingData?.inventory!);
        setContinueSelling(existingData?.continue_selling!);
        setProductType(existingData?.product_type!);
        setSupplier(existingData?.supplies!);
        setTags(existingData?.tags!);
    }, [existingData]);

    useEffect(() => {
        setVariantValues(existingData?.variants!);
        setForms(existingData?.form_combines!);
    }, [existingData?.variants, existingData?.form_combines]);

    const handleChange = (value: string, dispatch: Dispatch<SetStateAction<string>>) => {
        dispatch(value);
    };

    // State form variant

    const handleCreateFormVariant = () => {
        setForms([...forms, { date_id: Date.now(), title: '', values: [''], isDone: false }]);
    };

    const handleResetHistoryForm = () => {
        setForms(existingData?.form_combines!);
        setVariantValues(existingData?.variants!);
    };

    useEffect(() => {
        function generateCombinations(
            arrays: any[],
            index = 0,
            currentCombination: any[] = [],
            allCombinations: any[] = [],
        ) {
            if (index === arrays?.length) {
                const combinationObject = {
                    image: null,
                    price: '', // Bạn có thể tính toán giá theo cách bạn muốn
                    available: '',
                    combinations: [...currentCombination],
                };

                allCombinations.push(combinationObject);
                return;
            }

            for (let element of arrays[index]) {
                currentCombination[index] = element;
                generateCombinations(arrays, index + 1, currentCombination, allCombinations);
            }

            return allCombinations;
        }

        function hasAnyObjectChanged(oldArr: any[], newArr: any[]) {
            if (oldArr?.length !== newArr?.length) return true;

            for (let i = 0; i < oldArr?.length; i++) {
                if (oldArr[i].title !== newArr[i].title || oldArr[i].values !== newArr[i].values) {
                    return true;
                }
            }
            return false;
        }

        if (hasAnyObjectChanged(existingData?.form_combines!, forms)) {
            const newForms = forms?.map((form) => {
                return form?.values;
            });
            const combinations = generateCombinations(newForms);
            setVariantValues(combinations!);
        } else {
            setVariantValues(existingData?.variants!);
        }
    }, [forms, existingData?.variants, existingData?.form_combines]);

    const { mutate, isPending, error, isSuccess, isError } = useMutation({
        mutationFn: async (data: any) => {
            const response = await restApi.put(`/api/products/${existingData?.id}`, {
                ...data,
            });

            return response.data;
        },
        onError: (error) => {
            console.log('Error', error);

            if (variantValues) {
                variantValues?.forEach((value: any) => {
                    if (value.image === null) {
                        setInvalidField('Vui lòng hoàn thành các biến thể sản phẩm');
                    }
                });
            }

            if (imagesForOnes.length < 3) {
                setInvalidField('Vui lòng thêm ít nhất 3 ảnh');
            }
        },
        onSuccess: () => {
            console.log('Success');
            setTimeout(() => {
                router.refresh();
            }, 3000);
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (invalidField) {
            return;
        }

        const data = {
            title,
            description: description || null,
            category_id: categoryValue,
            image_ids: imagesForOnes || [],
            price: price || null,
            core: core || null,
            quantity_tracking: quantityTracking,
            continue_selling: continueSelling,
            region_of_origin: origin || null,
            variants: variantValues || null,
            activate: activeValue,
            product_type: productType || null,
            supplies: supplier || null,
            tags: tags || [],
            form_combines: forms || [],
            inventory,
        };

        mutate(data);
    };

    // console.log(variantValues);

    const amount = variantValues
        ?.map((variant) => {
            return Number(variant?.available?.split(' ')[0]);
        })
        .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        }, 0);

    if (!existingData) return <h1>Dữ liệu đã bị xóa</h1>;

    return (
        <Fragment>
            {isError && <ToastMessage isStatus="error" message="Lưu thay đổi thất bại" />}
            {isSuccess && <ToastMessage isStatus="success" message="Lưu thay đổi thành công" />}
            <Heading
                title={title}
                status={existingData.activate!}
                titleStatus={existingData.activate! === 'active' ? 'Đang hoạt động' : 'Đơn hàng nháp'}
                button={<BackButton />}
            />
            <form onSubmit={onSubmit}>
                <div className={styles.wrapper_new_form}>
                    <div className={styles.wrapper_form} style={{ minWidth: '51%', flex: '2 2 30rem' }}>
                        <div className={styles.wrapper}>
                            <FormControl
                                value={title}
                                defaultValue={title}
                                onChange={(e) => setTitle(e.target.value)}
                                label="Tiêu đề"
                                name="title"
                                id="title"
                                placeholder="Áo thun ngắn tay"
                                errorMessage={
                                    error && (error as AxiosError<{ errors: any }>).response?.data?.errors?.title
                                }
                            />
                            <FormControl editor label="Mô tả" name="description" id="description">
                                <TextEditor state={description} dispatch={setDescription} />
                            </FormControl>
                            <FormControl label="Phương tiện" name="images" id="images" uploadForm>
                                <UploadForm
                                    images={existingData?.images?.map((item) => item?.image!)}
                                    setImages={setImagesForOnes}
                                />
                            </FormControl>
                            <FormControl
                                onChange={(e) => setCategoryValue(e.target.value)}
                                value={categoryValue!}
                                selected
                                defaultValue={categoryValue!}
                                label="Danh mục"
                                name="category"
                                id="category"
                                errorMessage={
                                    error && (error as AxiosError<{ errors: any }>).response?.data?.errors?.category_id
                                }
                            >
                                <option value={''}>-- Lựa chọn --</option>
                                {categories &&
                                    categories?.map((item) => (
                                        <option value={item.id} key={item.id}>
                                            {item.title}
                                        </option>
                                    ))}
                            </FormControl>
                        </div>
                        <div className={styles.wrapper}>
                            <h2>Định giá</h2>

                            <div className={styles.form_grid}>
                                <FormControl format label="Giá">
                                    <NumericFormat
                                        suffix=" đ"
                                        placeholder="0"
                                        id="price"
                                        name="price"
                                        value={price}
                                        onChange={(e) => handleChange(e.target.value, setPrice)}
                                    />
                                </FormControl>
                                <FormControl
                                    label="Giá gốc"
                                    format
                                    question="Nhập giá trị cao hơn giá để hiển thị mức giảm giá. Thường hiển thị với đường gạch ngang chữ."
                                >
                                    <NumericFormat
                                        suffix=" đ"
                                        placeholder="0"
                                        id="core"
                                        name="core"
                                        value={core}
                                        onChange={(e) => handleChange(e.target.value, setCore)}
                                    />
                                </FormControl>
                            </div>
                        </div>
                        <div className={styles.wrapper}>
                            <h2>Kho hàng</h2>

                            <Checkbox
                                checkboxType="checkbox"
                                title="Theo dõi số lượng"
                                checked={quantityTracking}
                                onChange={(e) => setQuantityTracking(e.target.checked)}
                            />

                            <h3 className={styles.separate}>Số lượng</h3>

                            <div className={styles.form_between}>
                                <h4>Shop location</h4>
                                <FormControl
                                    type="number"
                                    value={inventory}
                                    defaultValue={inventory}
                                    onChange={(e) => setInventory(Number(e.target.value))}
                                    placeholder="0"
                                    min={0}
                                    style={{ width: 125 }}
                                />
                            </div>

                            <Checkbox
                                checkboxType="checkbox"
                                title="Tiếp tục bán khi hết hàng"
                                sub_title="Thao tác này sẽ không ảnh hưởng đến Shopify POS. Nhân viên sẽ thấy cảnh báo nhưng có thể hoàn tất
                                    giao dịch bán khi hàng trong kho có sẵn trở về 0 và dưới 0."
                                checked={continueSelling}
                                onChange={(e) => setContinueSelling(e.target.checked)}
                            />
                        </div>

                        <div className={styles.wrapper}>
                            <h2>Vận chuyển</h2>

                            <FormControl
                                defaultValue={''}
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                selected
                                label="Vùng xuất xứ"
                                question="Trong phần lớn trường hợp, đó là nơi sản xuất hoặc lắp ráp sản phẩm."
                            >
                                <option value="">-- Chọn vùng --</option>
                                {provinces?.map((item) => (
                                    <option value={item.name} key={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </FormControl>
                        </div>

                        <div className={styles.wrapper}>
                            {variantValues?.length > 0 && (
                                <h2>
                                    <span>Mẫu mã</span>
                                    <span onClick={handleResetHistoryForm}>
                                        Hủy thay đổi
                                        <GrPowerReset />
                                    </span>
                                </h2>
                            )}

                            {forms?.length === 0 && (
                                <Button
                                    sx={{ justifyContent: 'left', padding: 0 }}
                                    activeType="button"
                                    type="button"
                                    variant="underline"
                                    placement="left"
                                    icon={IoIosAddCircleOutline}
                                    onClick={handleCreateFormVariant}
                                >
                                    Thêm các tuỳ chọn như kích cỡ hoặc màu sắc
                                </Button>
                            )}

                            {forms?.length > 0 && (
                                <VariantForm forms={forms} setForms={setForms} createForm={handleCreateFormVariant} />
                            )}

                            <div className={styles.grid_variant}>
                                <div className={`${styles.header} ${styles.box}`}>
                                    <div className={styles.col_span_5}>Mẫu mã</div>

                                    <div className={styles.col_span_2}>Giá</div>
                                    <div className={styles.col_span_1}>Có sẵn</div>
                                </div>

                                {(forms?.length > 0 || variantValues?.length > 0) &&
                                    variantValues?.map((variant, index) => {
                                        return (
                                            <VariantItem
                                                key={index}
                                                variant={variant!}
                                                setState={setVariantValues}
                                                variantId={index}
                                                state={variantValues}
                                            />
                                        );
                                    })}

                                <div className={styles.location}>
                                    Tổng hàng trong kho tại Shop location: {amount} có sẵn
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.wrapper_form} style={{ minWidth: 0, flex: '1 1 15rem' }}>
                        <div className={styles.wrapper}>
                            <h2>Trạng thái</h2>

                            <FormControl
                                defaultValue={activeValue}
                                value={activeValue}
                                onChange={(e) => setActivateValue(e.target.value)}
                                selected
                            >
                                {activates?.map((item) => (
                                    <option value={item.id} key={item.id}>
                                        {item.title}
                                    </option>
                                ))}
                            </FormControl>
                        </div>

                        <div className={styles.wrapper}>
                            <h2>Sắp xếp sản phẩm</h2>

                            <FormControl
                                label="Loại sản phẩm"
                                value={productType}
                                onChange={(e) => setProductType(e.target.value)}
                                question="Tạo danh mục tùy chỉnh cho sản phẩm"
                            />

                            <FormControl
                                label="Nhà cung cấp"
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                            />

                            <FormControl
                                onChange={(e) => {
                                    const valueArray = e.target.value.split(',').map((v) => v.toLowerCase().trim());
                                    const newValues = [...new Set(valueArray)];
                                    setTags(newValues);
                                }}
                                defaultValue={[...new Set(tags)].join(', ')}
                                label='Thẻ (giá trị cách nhau bằng dấu ", ")'
                                value={[...new Set(tags)].join(', ')}
                            >
                                {tags &&
                                    tags[0]?.length > 0 &&
                                    tags.map((tag, index) => (
                                        <Chip
                                            sx={{
                                                marginRight: '6px',
                                                marginTop: '6px',
                                                boxShadow: '0  0 3px rgba(0,0,0,0.6)',
                                            }}
                                            size="medium"
                                            color="default"
                                            key={index}
                                            label={tag}
                                        />
                                    ))}
                            </FormControl>
                        </div>
                    </div>
                </div>

                <div className={styles.save}>
                    <div className={styles.save_wrapper}>
                        <div className={`${styles.save_box} ${styles.save_warning}`}>
                            <CiWarning /> <span>Sản phẩm chưa được lưu</span>
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
});

export default UpdateProductForm;
