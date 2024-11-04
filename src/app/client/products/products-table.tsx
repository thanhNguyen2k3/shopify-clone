'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MdOutlineInventory2 } from 'react-icons/md';
import { TfiTrash } from 'react-icons/tfi';
import { IoIosMore } from 'react-icons/io';
import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { IoEyeOutline } from 'react-icons/io5';
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
import { ExtandDataProps } from '@/types';
import BadgeCustom from '@/components/badge/badge';
import { PER_PAGE } from '@/const';

function NoRowsOverlay() {
    return (
        <Stack height="100%" alignItems="center" justifyContent="center">
            No rows in DataGrid
            <pre>(rows=&#123;[]&#125;)</pre>
        </Stack>
    );
}

const ProductTable = () => {
    // Query key
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

    // update status value on product

    const { mutate, isPending } = useMutation({
        mutationFn: async (activate: string) => {
            const response = await restApi.post(`/api/products/update-many`, {
                ids: ids,
                activate,
            });

            return response.data;
        },
        onError: (error) => {
            console.log('ERROR', error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] }).then(() => setIds([]));
        },
    });

    const onChange = (_e: any, pagesize: number) => {
        router.push(`${pathname}?${createQueryString([{ name: 'page', value: pagesize.toString() }])}`);
    };

    // Table columns & rows

    const columns: GridColDef<ExtandDataProps>[] = [
        {
            field: 'image',
            headerName: '',
            width: 60,
            renderCell: ({ row }) => (
                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Image unoptimized src={row.images![0].image?.url!} alt="thumbnail" width={40} height={40} />
                </div>
            ),
            sortable: false,
            filterable: false,
        },
        {
            field: 'title',
            headerName: 'Sản phẩm',
            width: 220,
            renderCell: ({ row }) => (
                <div className={styles.info}>
                    <Link href={`/products/${row?.id}`}>{row?.title}</Link>
                    <Link href={`/detail/${row?.id}`}>
                        <IoEyeOutline href={`/detail/${row.id}`} />
                    </Link>
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
        {
            field: 'inventory',
            headerName: 'Hàng trong kho',
            width: 190,
            filterable: false,
            valueGetter: (value, row) => {
                const inventory = row.variants
                    ? row.variants.reduce((v, init) => {
                          const total = Number(init?.available?.split(' ')[0]) + v + row.inventory!;

                          return total;
                      }, 0)
                    : row.inventory;

                return `Hiện còn ${inventory} trong kho`;
            },
        },
        {
            field: 'category',
            headerName: 'Danh mục',
            width: 130,
            valueGetter: (value, row) => `${row.category?.title || 'Chưa cập nhật'}`,
            filterable: false,
        },
        {
            field: 'product_type',
            headerName: 'Loại',
            width: 90,
            valueGetter: (value) => value || 'Chưa cập nhật',
            filterable: false,
        },
        {
            field: 'supplies',
            headerName: 'Nhà cung cấp',
            width: 130,
            valueGetter: (value) => value || 'Chưa cập nhật',
            filterable: false,
        },
        {
            field: 'createdAt',
            headerName: 'Ngày tạo',
            width: 220,
            valueGetter: (_value, row) => new Date(row?.createdAt)?.toLocaleDateString(),
        },
    ];

    // Date time picker
    const [showDate, setShowDate] = useState(false);

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

                            {/* <TippyCustom
                                interactive
                                trigger="click"
                                placement="bottom-end"
                                arrow
                                render={(attrs) => (
                                    <LocalizationProvider adapterLocale="vi" dateAdapter={AdapterDayjs}>
                                        <DateCalendar
                                            sx={{ backgroundColor: 'white', boxShadow: '0 0 1px rgba(0,0,0.3)' }}
                                            onChange={(value) => {
                                                router.push(
                                                    `${pathname}?${createQueryString([
                                                        {
                                                            name: 'date',
                                                            value: value.$d,
                                                        },
                                                    ])}`,
                                                );
                                            }}
                                            {...attrs}
                                        />
                                    </LocalizationProvider>
                                )}
                            >
                                <Button onClick={() => setShowDate(!showDate)} activeType="button" variant="defaulted">
                                    Lọc theo ngày
                                </Button>
                            </TippyCustom> */}
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
                    {/* Action data grid */}
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
                    {/* Table grid data */}
                    <div className={styles.table_wrapper}>
                        <DataGrid
                            rowHeight={62}
                            rows={products?.data!}
                            columns={columns}
                            hideFooterPagination
                            checkboxSelection
                            sx={{ border: 0, minHeight: 500 }}
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
                            disableRowSelectionOnClick
                        />
                    </div>
                </div>

                {/* Pagination */}
            </div>
            <div className={styles.paginate_wrapper}>
                {products?.data?.length! > 0 && (
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
