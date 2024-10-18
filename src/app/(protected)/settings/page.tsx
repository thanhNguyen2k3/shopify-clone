import React from 'react';
import Settings from './settings';
import { auth } from '@/auth';

const SettingsPage = async () => {
    const session = await auth();

    return <Settings session={session} />;
};

export default SettingsPage;
