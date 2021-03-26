import Page from '../components/Page.js';
import NProgress from 'nprogress'
import '../components/styles/nprogress.css';
import Router from 'next/router';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function TheApp({Component, pageProps}) {
  return (
    <Page>
      <Component {...pageProps} />
    </Page>
  );
}