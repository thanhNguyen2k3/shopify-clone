'use client';

import { GrGroup } from 'react-icons/gr';
import { MdOutlineSell, MdOutlineLineAxis } from 'react-icons/md';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import OverviewCard from '@/components/overview-card/overview-card';
import styles from './dashboard.module.scss';
import Heading from '@/components/haeding/heading';
import { useResponsive } from '@/hooks/useResponsive';
import { ExtandOrder } from '@/types';
import { restApi } from '@/configs/axios';
import BadgeCustom from '@/components/badge/badge';

type Props = {
    totalRevenues: number;
    totalSupscriptions: number;
    totalSales: number;
    totalActiveProduct: number;
    graphData: { name: string; total: number }[];
    graphStatus: { name: string; total: number }[];
};

type PieChartProps = {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: PieChartProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const Dashboard = ({
    totalActiveProduct,
    totalRevenues,
    totalSales,
    totalSupscriptions,
    graphData,
    graphStatus,
}: Props) => {
    const breakpoints = useResponsive([1000]);

    const COLORS = ['#00C49F', '#FFBB28', '#FF8042'];

    // Purchase order
    const { data: orders, isLoading } = useQuery<{ data: ExtandOrder[] }>({
        queryKey: ['purchase_orders'],
        queryFn: async () => {
            const response = await restApi.get(`/api/purchase_orders`);

            return response.data;
        },
        refetchOnMount: true,
    });

    const columns: GridColDef<ExtandOrder>[] = [
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
    ];

    return (
        <div className={styles.wrapper}>
            <Heading title="Tổng quan" />

            <div
                className={styles.total_box}
                style={
                    breakpoints === 0
                        ? { gridTemplateColumns: 'repeat(2,1fr)' }
                        : { gridTemplateColumns: 'repeat(4,1fr)' }
                }
            >
                <OverviewCard title="Tổng doanh thu" total={`${totalRevenues.toLocaleString()}`} />
                <OverviewCard Icon={GrGroup} title="Đăng ký" total={totalSupscriptions} />
                <OverviewCard Icon={MdOutlineSell} title="Hàng đã bán" total={totalSales} />
                <OverviewCard Icon={MdOutlineLineAxis} title="Sản phẩm đang hoạt động" total={totalActiveProduct} />
            </div>

            <div className={styles.chart}>
                <h2>Bảng thu</h2>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={graphData}>
                        <Tooltip />
                        <XAxis dataKey={'name'} stroke="#888888" fontSize={12} />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickFormatter={(value: number) => `${value.toLocaleString()}`}
                        />
                        <Bar dataKey={'total'} fill="#31a0c9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.chart}>
                <h2>Bảng thống trạng thái</h2>
                <div className={styles.wrapper_chart}>
                    <div className={styles.pie}>
                        <ResponsiveContainer width={200} height={200}>
                            <PieChart width={200} height={200}>
                                <Tooltip />
                                <Pie
                                    data={graphStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="total"
                                >
                                    {graphStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 400 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Khách hàng</TableCell>
                                    <TableCell align="right">Trạng thái</TableCell>
                                    <TableCell align="right">Tổng tiền</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders?.data?.map((row) => (
                                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">
                                            {row.contact_information.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            <BadgeCustom title={row.status} status={row.status} />
                                        </TableCell>

                                        <TableCell align="right">{row.total.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
