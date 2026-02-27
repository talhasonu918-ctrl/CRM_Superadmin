
import React, { useEffect } from 'react';
import { Layout } from '@/src/components/NavigationLayout';
import { useAppSelector, useAppDispatch } from '@/src/redux/store';
import { SettingsView } from '@/src/app/modules/settings/index';
import { useRouter } from 'next/router';
import { syncCompanyFromUrl } from '@/src/redux/companySlice';

export default function Settings() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (router.query.company) {
      dispatch(syncCompanyFromUrl({ company: router.query.company as string, asPath: router.asPath }));
    }
  }, [router.query.company, router.asPath, dispatch]);

  return (
    <Layout>
      <SettingsView isDarkMode={isDarkMode} />
    </Layout>
  );
}