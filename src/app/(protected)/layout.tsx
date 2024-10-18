import Layout from '@/context/root';
import React from 'react';

type Props = {
    children: React.ReactNode;
};

const AdminLayout = (props: Props) => {
    return <Layout>{props.children}</Layout>;
};

export default AdminLayout;
