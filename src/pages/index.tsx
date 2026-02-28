// ✅ Server-side redirect - runs BEFORE any JavaScript on the browser.
// This means iOS Safari, Android, Chrome all redirect instantly.
// No spinner, no useEffect, no localStorage needed at this point.
// The /auth page handles the "already logged in" case and redirects to dashboard.
export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/auth',
      permanent: false,
    },
  };
}

// This component never actually renders because getServerSideProps redirects first.
export default function Home() {
  return null;
}