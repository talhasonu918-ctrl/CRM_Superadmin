import React from 'react';
import { PracticeView } from '../../modules/settings/practice';
import { Layout } from '../../../components/NavigationLayout';

export default function PracticeSettings() {
    return (
        <Layout>
            <PracticeView isDarkMode={false} />
        </Layout>
    );
}
