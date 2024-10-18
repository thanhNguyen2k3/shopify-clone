'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MdCheck, MdOutlineInventory2 } from 'react-icons/md';
import { TfiTrash } from 'react-icons/tfi';
import { IoIosMore } from 'react-icons/io';
import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { IoEyeOutline } from 'react-icons/io5';
import Pagination from '@mui/material/Pagination';
import Image from 'next/image';
import Link from 'next/link';

import Button from '@/components/button/button';
import styles from './products-table.module.scss';
import Search from '@/components/search/search';
import TippyCustom from '@/tippy/tippy-custom';
import Modal from '@/components/modal/modal';
import { restApi } from '@/configs/axios';
import { ExtandDataProps } from '@/types';
import BadgeCustom from '@/components/badge/badge';
import Checkbox from '@/components/checkbox/checkbox';
import Loader from '@/components/animation/loading/loader';
import ArrangeButton from '@/components/arrange-button/arrange-button';
import { PER_PAGE } from '@/const';

type Props = {};

const ProductTable = (props: Props) => {
    // data

    const labels = [
        {
            id: 'archived',
            title: 'Lưu trữ sản phẩm',
            variant: 'defaulted',
            icon: MdOutlineInventory2,
            children: {
                title: 'Lưu trữ sản phẩm?',
                body: 'Lưu trữ sản phẩm sẽ ẩn sản phẩm khỏi kênh bán hàng và trang quản trị Shopify. Bạn sẽ tìm thấy sản phẩm khi sử dụng bộ lọc trạng thái trong danh sách sản phẩm.',
                footer: 'Lưu trữ sản phẩm',
                variant: 'primary',
            },
        },
        {
            id: 'remove',
            title: 'Xóa sản phẩm',
            variant: 'error',
            icon: TfiTrash,
            children: {
                title: 'Xóa sản phẩm?',
                body: 'Thao tác này không thể hoàn tác.',
                footer: 'Xóa',
                variant: 'remove',
            },
        },
    ];

    // State
    const [ids, setIds] = useState<string[]>([]);
    const [selectedAll, setSelectedAll] = useState<boolean>(false);

    // Search value
    const [searchValue, setSearchValue] = useState<string>('');

    // Modal state
    const [modalContent, setModalContent] = useState<{
        title: string;
        body: string;
        footer: string;
        variant?: string;
    }>();
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleGetContentForModal = (modal: any) => {
        setModalContent({ ...modal });
        setShowModal(true);
    };

    // Handle
    const isChecked = (value: string) => ids.includes(value);
    const handleSelected = (id: string) => {
        setIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSelectedAll = () => {
        const selectedIds = products?.data?.map((item) => item?.id);
        setSelectedAll(!selectedAll);

        if (selectedAll) {
            return setIds([]);
        } else {
            return setIds(selectedIds!);
        }
    };

    // Query Data
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [arrangeValue, setArrangeValue] = useState<boolean>(true);
    const [count, setCount] = useState<number | null>(null);

    const createQueryString = useCallback(
        (querys = [{ name: '', value: '' }]) => {
            const params = new URLSearchParams(searchParams.toString());

            querys.map((query) => {
                return params.set(query.name, query.value);
            });

            return params.toString();
        },
        [searchParams],
    );

    const viewQuery = searchParams.get('view') ?? 'all';
    const orderQuery = searchParams.get('orderby') ?? 'title';
    const arrangeQuery = searchParams.get('arrange') ?? 'desc';
    const page = searchParams.get('page') ?? '1';
    const currentPage = parseInt(page, 10);

    const { data: products, isLoading } = useQuery<{ data: ExtandDataProps[] }>({
        queryKey: ['products', viewQuery, arrangeQuery, orderQuery, searchValue, page],
        queryFn: async () => {
            const response = await restApi.get(
                `/api/products?search=${searchValue}&view=${viewQuery}&orderby=${orderQuery}&arrange=${arrangeQuery}&page=${page}`,
            );

            const totalCount = response.data.count;
            const totalPages = Math.ceil(totalCount / PER_PAGE);

            setCount(totalPages);

            return response.data;
        },
        refetchOnMount: true,
    });

    const onChange = (_e: any, pagesize: number) => {
        router.push(`${pathname}?${createQueryString([{ name: 'page', value: pagesize.toString() }])}`);
    };

    return (
        <div>
            <div className={styles.wrapper}>
                <div className={styles.wrapper_header}>
                    <div className={styles.buttons}>
                        <div className={styles.wrapper_button}>
                            <Button
                                onClick={() =>
                                    router.push(`${pathname}?${createQueryString([{ name: 'view', value: 'all' }])}`)
                                }
                                activeType="button"
                                variant="defaulted"
                            >
                                Tất cả
                            </Button>
                            <Button
                                onClick={() =>
                                    router.push(`${pathname}?${createQueryString([{ name: 'view', value: 'active' }])}`)
                                }
                                activeType="button"
                                variant="defaulted"
                            >
                                Đang hoạt động
                            </Button>
                            <Button
                                onClick={() =>
                                    router.push(
                                        `${pathname}?${createQueryString([{ name: 'view', value: 'inActive' }])}`,
                                    )
                                }
                                activeType="button"
                                variant="defaulted"
                            >
                                Đã lưu trữ
                            </Button>
                        </div>
                    </div>
                    <div className={styles.wrapper_action}>
                        <Search searchValue={searchValue} searchDispatch={setSearchValue} />
                    </div>
                </div>

                {/* Modal */}

                <Modal modal={showModal} setModal={setShowModal} {...modalContent} />

                {/* table */}

                <div className={styles.box}>
                    {ids && ids.length > 0 && (
                        <div className={styles.table_action}>
                            <div style={{ display: 'flex', columnGap: 12 }}>
                                <div
                                    onClick={handleSelectedAll}
                                    className={`${styles.checkbox} ${selectedAll && styles.active}`}
                                >
                                    <MdCheck />
                                </div>
                                <p>Đã chọn {ids.length} </p>
                            </div>
                            <div className={styles.table_action_item}>
                                <Button sx={{ height: 24 }} activeType="button" variant="custom">
                                    Chỉnh sửa hàng loạt
                                </Button>
                                <Button sx={{ height: 24 }} activeType="button" variant="custom">
                                    Đặt thành đang hoạt động
                                </Button>
                                <TippyCustom
                                    interactive
                                    trigger="click"
                                    placement="bottom-end"
                                    render={(attrs) => (
                                        <div {...attrs} className={styles.box_action}>
                                            {labels.map((label) => (
                                                <Button
                                                    onClick={() => handleGetContentForModal(label.children)}
                                                    activeType="button"
                                                    icon={label.icon}
                                                    placement="left"
                                                    sx={{
                                                        width: '100%',
                                                        fontWeight: 500,
                                                        justifyContent: 'start',
                                                        height: 32,
                                                    }}
                                                    variant={label.variant as any}
                                                    key={label.id}
                                                >
                                                    {label.title}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                >
                                    <Button
                                        sx={{ columnGap: 0 }}
                                        activeType="button"
                                        variant="custom"
                                        placement="left"
                                        icon={IoIosMore}
                                    />
                                </TippyCustom>
                            </div>
                        </div>
                    )}
                    <div className={styles.table_wrapper}>
                        <table cellSpacing={0} cellPadding={0} className={styles.table}>
                            <thead className={styles.table_head}>
                                <tr>
                                    <th>
                                        <Checkbox checkboxType="checkbox" onChange={handleSelectedAll} />
                                    </th>
                                    <th></th>
                                    <th>
                                        <ArrangeButton
                                            onClick={() => {
                                                setArrangeValue(!arrangeValue);

                                                router.replace(
                                                    `${pathname}?${createQueryString([
                                                        { name: 'orderby', value: 'title' },
                                                        { name: 'arrange', value: arrangeValue ? 'desc' : 'asc' },
                                                    ])}`,
                                                );
                                            }}
                                            arrange={arrangeQuery}
                                            tooltip="A-Z"
                                        >
                                            Sản phẩm
                                        </ArrangeButton>
                                    </th>
                                    <th>Trạng thái</th>
                                    <th>
                                        <ArrangeButton
                                            onClick={() => {
                                                setArrangeValue(!arrangeValue);

                                                router.replace(
                                                    `${pathname}?${createQueryString([
                                                        { name: 'orderby', value: 'inventory' },
                                                        { name: 'arrange', value: arrangeValue ? 'desc' : 'asc' },
                                                    ])}`,
                                                );
                                            }}
                                            arrange={arrangeQuery}
                                            tooltip="Nhỏ đến lớn"
                                        >
                                            Hàng trong kho
                                        </ArrangeButton>
                                    </th>
                                    <th>Danh mục</th>
                                    <th>Loại</th>
                                    <th>Nhà cung cấp</th>
                                </tr>
                            </thead>

                            <tbody className={styles.table_body}>
                                {isLoading && (
                                    <tr>
                                        <td>
                                            <Loader style={{ position: 'absolute' }} />
                                        </td>
                                    </tr>
                                )}
                                {products?.data.length === 0 ? (
                                    <tr className={styles.no_rows}>
                                        <td>Chưa có sản phẩm nào 😪</td>
                                    </tr>
                                ) : (
                                    products?.data?.map((item) => {
                                        return (
                                            <tr key={item?.id} className={`${isChecked(item?.id) && styles.checked}`}>
                                                <td>
                                                    <Checkbox
                                                        checkboxType="checkbox"
                                                        checked={isChecked(item?.id)}
                                                        onChange={() => handleSelected(item?.id)}
                                                    />
                                                </td>
                                                <td>
                                                    <Image
                                                        unoptimized
                                                        width={40}
                                                        height={40}
                                                        src={item?.images![0]?.image?.url!}
                                                        alt="image"
                                                    />
                                                </td>
                                                <td>
                                                    <div className={styles.info}>
                                                        <Link href={`/products/${item?.id}`}>{item?.title}</Link>
                                                        <Link href={`/detail/${item?.id}`}>
                                                            <IoEyeOutline fontSize={16} />
                                                        </Link>
                                                    </div>
                                                </td>
                                                <td>
                                                    <BadgeCustom status={item?.activate!} title={item?.activate!} />
                                                </td>
                                                <td>Còn {item?.inventory || '0'} trong kho</td>
                                                <td>{item?.category?.title || 'Chưa cập nhật'}</td>
                                                <td>{item?.product_type || 'Chưa cập nhật'}</td>
                                                <td>{item?.supplies || 'Chưa cập nhật'}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
            </div>
            <div className={styles.paginate_wrapper}>
                {products?.data.length! > 0 && (
                    <Pagination
                        onChange={onChange}
                        count={count!}
                        page={currentPage}
                        variant="outlined"
                        shape="rounded"
                    />
                )}
            </div>
        </div>
    );
};

export default ProductTable;
