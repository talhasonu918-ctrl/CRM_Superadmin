import React from 'react';
import { BranchesView } from '../../modules/settings/branches';
import { Layout } from '../../../components/NavigationLayout';

export default function BranchesSettings() {
    return (
        <Layout>
            <BranchesView isDarkMode={false} />
        </Layout>
    );
}
