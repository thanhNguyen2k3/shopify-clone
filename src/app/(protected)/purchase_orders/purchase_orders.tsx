'use client';
import { IoIosMore } from 'react-icons/io';
import Stack from '@mui/material/Stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { MdOutlineInventory2 } from 'react-icons/md';
import { TfiTrash } from 'react-icons/tfi';
import Pagination from '@mui/material/Pagination';
import { useReactToPrint } from 'react-to-print';
import { ORDER_STATUS } from '@prisma/client';

import Button from '@/components/button/button';
import styles from '../../css/table.module.scss';
import styleOrder from './purchase_orders.module.scss';
import { ExtandOrder } from '@/types';
import { restApi } from '@/configs/axios';
import { PER_PAGE } from '@/const';
import BadgeCustom from '@/components/badge/badge';
import Search from '@/components/search/search';
import Modal from '@/components/modal/modal';
import TippyCustom from '@/tippy/tippy-custom';
import OrderCard from '@/components/order-card/order-card';

function NoRowsOverlay() {
    return (
        <Stack height="100%" alignItems="center" justifyContent="center">
            No rows in DataGrid
            <pre>(rows=&#123;[]&#125;)</pre>
        </Stack>
    );
}

const PurchaseOrders = () => {
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
                title: 'Lưu trữ đơn hàng?',
                body: 'Lưu trữ sản phẩm sẽ ẩn sản phẩm khỏi kênh bán hàng và trang quản trị Shopify. Bạn sẽ tìm thấy sản phẩm khi sử dụng bộ lọc trạng thái trong danh sách sản phẩm.',
                footer: 'Lưu trữ sản phẩm',
                variant: 'primary',
            },
        },
        {
            id: 'remove',
            title: 'Xóa đơn hàng',
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
    const page = searchParams.get('page') ?? '1';
    const currentPage = parseInt(page, 10);

    const { data: orders, isLoading } = useQuery<{ data: ExtandOrder[] }>({
        queryKey: ['purchase_orders', viewQuery, searchValue, page],
        queryFn: async () => {
            const response = await restApi.get(
                `/api/purchase_orders?search=${searchValue}&view=${viewQuery}&page=${page}`,
            );

            const totalCount = response.data.count;
            const totalPages = Math.ceil(totalCount / PER_PAGE);

            setCount(totalPages);

            return response.data;
        },
        refetchOnMount: true,
    });

    // update status value on order

    const { mutate, isPending } = useMutation({
        mutationFn: async (orders_status: ORDER_STATUS) => {
            const response = await restApi.post(`/api/purchase_orders/status`, {
                ids: ids,
                orders_status,
            });

            return response.data;
        },
        onError: (error) => {
            console.log('ERROR', error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase_orders'] }).then(() => setIds([]));
        },
    });

    const onChange = (_e: any, pagesize: number) => {
        router.push(`${pathname}?${createQueryString([{ name: 'page', value: pagesize.toString() }])}`);
    };

    // Print payment

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    // Table columns & rows

    const columns: GridColDef<ExtandOrder>[] = [
        {
            field: 'id',
            headerName: 'Mã đơn',
            width: 220,
            renderCell: ({ row }) => (
                <Button sx={{ padding: 0 }} activeType="link" variant="underline" href={`/purchase_orders/${row.id}`}>
                    {row.id}
                </Button>
            ),
        },
        {
            field: 'user',
            headerName: 'Khách hàng',
            width: 220,
            valueGetter: (_value, row) => {
                return row.contact_information.name;
            },
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 120,
            renderCell: ({ row }) => <BadgeCustom status={row.status!} title={row.status!} />,
            sortable: false,
            filterable: false,
        },
        {
            field: 'total',
            headerName: 'Tổng đơn hàng',
            width: 190,
            filterable: false,

            renderCell: ({ row }) => <span style={{ color: 'red' }}>{row?.total?.toLocaleString()}</span>,
        },
        {
            field: 'createdAt',
            headerName: 'Ngày tạo',
            width: 220,
            valueGetter: (_value, row) => new Date(row?.createdAt)?.toLocaleDateString(),
        },
        {
            field: 'action',
            headerName: 'Hành động',
            width: 120,
            renderCell: ({ row }) => {
                console.log(row);

                return (
                    <>
                        <Button onClick={() => reactToPrintFn()} activeType="button" variant="underline">
                            In hóa đơn
                        </Button>

                        {contentRef && <OrderCard ref={contentRef} data={row!} />}
                    </>
                );
            },
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
                            <select
                                onChange={(e) => {
                                    if (ids) mutate(e.target.value as ORDER_STATUS);
                                }}
                                defaultValue={ORDER_STATUS.AWAITING}
                                className={styleOrder.select_option}
                            >
                                <option style={{ backgroundColor: '#dddddd' }} value={ORDER_STATUS.AWAITING}>
                                    {ORDER_STATUS.AWAITING}
                                </option>
                                <option style={{ backgroundColor: '#d5ebff' }} value={ORDER_STATUS.CONFIRMED}>
                                    {ORDER_STATUS.CONFIRMED}
                                </option>
                                <option style={{ backgroundColor: '#58aeff' }} value={ORDER_STATUS.SHIPPING}>
                                    {ORDER_STATUS.SHIPPING}
                                </option>
                                <option style={{ backgroundColor: '#44ff00' }} value={ORDER_STATUS.SHIPPED}>
                                    {ORDER_STATUS.SHIPPED}
                                </option>
                                <option style={{ backgroundColor: '#d12aff' }} value={ORDER_STATUS.NEED_EVALUATION}>
                                    {ORDER_STATUS.NEED_EVALUATION}
                                </option>
                                <option style={{ backgroundColor: '#fff700' }} value={ORDER_STATUS.RETURN}>
                                    {ORDER_STATUS.RETURN}
                                </option>
                                <option style={{ backgroundColor: '#ff2200' }} value={ORDER_STATUS.CANCELLED}>
                                    {ORDER_STATUS.CANCELLED}
                                </option>
                            </select>
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
                            rows={orders?.data!}
                            columns={columns}
                            hideFooterPagination
                            checkboxSelection
                            sx={{ border: 0, minHeight: 500 }}
                            onRowSelectionModelChange={(row) => {
                                setIds(row as string[]);
                            }}
                            loading={isLoading || isPending}
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
                {orders?.data?.length! > 0 && (
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

export default PurchaseOrders;
