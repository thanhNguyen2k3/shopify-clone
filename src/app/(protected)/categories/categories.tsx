'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MdCheck, MdOutlineInventory2 } from 'react-icons/md';
import { TfiTrash } from 'react-icons/tfi';
import { IoIosMore } from 'react-icons/io';
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Pagination from '@mui/material/Pagination';
import Image from 'next/image';
import Link from 'next/link';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';

import Button from '@/components/button/button';
import styles from '@/app/css/table.module.scss';
import Search from '@/components/search/search';
import TippyCustom from '@/tippy/tippy-custom';
import Modal from '@/components/modal/modal';
import { restApi } from '@/configs/axios';
import { ExtandCategory } from '@/types';
import { PER_PAGE } from '@/const';
import BadgeCustom from '@/components/badge/badge';

function NoRowsOverlay() {
    return (
        <Stack height="100%" alignItems="center" justifyContent="center">
            No rows in DataGrid
            <pre>(rows=&#123;[]&#125;)</pre>
        </Stack>
    );
}

const CategoriesTable = () => {
    // Query

    const queryClient = useQueryClient();

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
        const selectedIds = categories?.data?.map((item) => item?.id);
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

    const { data: categories, isLoading } = useQuery<{ data: ExtandCategory[] }>({
        queryKey: ['categories', viewQuery, arrangeQuery, orderQuery, searchValue, page],
        queryFn: async () => {
            const response = await restApi.get(
                `/api/category?search=${searchValue}&view=${viewQuery}&orderby=${orderQuery}&arrange=${arrangeQuery}&page=${page}`,
            );

            const totalCount = response.data.count;
            const totalPages = Math.ceil(totalCount / PER_PAGE);

            setCount(totalPages);

            return response.data;
        },
        refetchOnMount: true,
    });

    // On update active value on category

    const { mutate, isPending } = useMutation({
        mutationFn: async (activate: string) => {
            const response = await restApi.post(`/api/category/update-many`, {
                ids: ids,
                activate,
            });

            return response.data;
        },
        onError: (error) => {
            console.log('ERROR', error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] }).then(() => setIds([]));
        },
    });

    const onChange = (_e: any, pagesize: number) => {
        router.push(`${pathname}?${createQueryString([{ name: 'page', value: pagesize.toString() }])}`);
    };

    // Table columns & rows

    const columns: GridColDef<ExtandCategory>[] = [
        {
            field: 'image',
            headerName: '',
            width: 130,
            renderCell: ({ row }) => (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    {row.image ? (
                        <Image unoptimized src={row?.image?.url!} alt="thumbnail" width={40} height={40} />
                    ) : (
                        'Chưa cập nhật'
                    )}
                </div>
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: 'title',
            headerName: 'Tên danh mục',
            width: 220,
            renderCell: ({ row }) => (
                <div className={styles.info}>
                    <Link href={`/categories/${row?.id}`}>{row?.title}</Link>
                </div>
            ),
        },
        {
            field: 'activate',
            headerName: 'Trạng thái',
            width: 90,
            renderCell: ({ row }) => <BadgeCustom status={row.activate!} title={row.activate!} />,
            sortable: false,
            filterable: false,
        },
    ];

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
                    <div
                        className={styles.table_action}
                        style={
                            ids.length > 0
                                ? { height: '50px', visibility: 'visible', padding: '14px', opacity: 1 }
                                : { height: '0px', visibility: 'hidden' }
                        }
                    >
                        <div style={{ display: 'flex', columnGap: 12, alignItems: 'center' }}>
                            <p>Đã chọn {ids.length} </p>
                        </div>
                        <div className={styles.table_action_item}>
                            <Button sx={{ height: 24 }} activeType="button" variant="custom">
                                Chỉnh sửa hàng loạt
                            </Button>
                            <Button
                                sx={{ height: 24 }}
                                onClick={() => mutate('active')}
                                activeType="button"
                                variant={isPending ? 'disabled' : 'custom'}
                            >
                                Đặt thành đang hoạt động
                            </Button>
                            <Button
                                sx={{ height: 24 }}
                                onClick={() => mutate('inActive')}
                                activeType="button"
                                variant={isPending ? 'disabled' : 'custom'}
                            >
                                Đặt thành ngưng hoạt động
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

                    <div className={styles.table_wrapper}>
                        <DataGrid
                            rowHeight={62}
                            rows={categories?.data!}
                            columns={columns}
                            hideFooterPagination
                            checkboxSelection
                            sx={{ border: 0, minHeight: 400 }}
                            onRowSelectionModelChange={(row) => {
                                setIds(row as string[]);
                            }}
                            loading={isLoading}
                            localeText={{
                                toolbarDensity: 'Size',
                                toolbarDensityLabel: 'Size',
                                toolbarDensityCompact: 'Nhỏ',
                                toolbarDensityStandard: 'Trung bình',
                                toolbarDensityComfortable: 'Lớn',
                                toolbarFiltersLabel: 'Lọc',
                                toolbarFilters: 'Lọc',
                                toolbarExport: 'Xuất file',
                                toolbarExportCSV: 'Xuất file CSV',
                                toolbarExportPrint: 'In',
                            }}
                            slots={{ toolbar: GridToolbar, noRowsOverlay: NoRowsOverlay }}
                            slotProps={{
                                loadingOverlay: {
                                    variant: 'skeleton',
                                    noRowsVariant: 'skeleton',
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Pagination */}
            </div>
            <div className={styles.paginate_wrapper}>
                {categories?.data.length! > 0 && (
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

export default CategoriesTable;
