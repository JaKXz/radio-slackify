import '../styles/globals.css';
import type {AppProps} from 'next/app';
import '../styles/slider.css';
import '../styles/stationPlaylist.css';

function MyApp({Component, pageProps}: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
