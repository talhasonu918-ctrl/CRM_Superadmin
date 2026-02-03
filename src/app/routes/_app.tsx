import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../../styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Nexus CRM - SuperAdmin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;