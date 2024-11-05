import {
    getActiveProduct,
    getSales,
    getSubsciptions,
    getTotalRevenue,
    getTotalRevenueForMonth,
    getStatusOrder,
} from '@/actions/revenue';
import Dashboard from './dashboard';

type Props = {};

const DashboardPage = async (props: Props) => {
    const totalRevenue = await getTotalRevenue();
    const totalSubscriptions = await getSubsciptions();
    const totalSales = await getSales();
    const totalActiveProduct = await getActiveProduct();
    const graphData = await getTotalRevenueForMonth();
    const graphStatusOrder = await getStatusOrder();

    console.log(graphStatusOrder);

    return (
        <Dashboard
            totalRevenues={totalRevenue}
            totalActiveProduct={totalActiveProduct}
            totalSales={totalSales}
            totalSupscriptions={totalSubscriptions}
            graphData={graphData}
            graphStatus={graphStatusOrder}
        />
    );
};

export default DashboardPage;
