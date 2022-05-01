import type { AppProps } from 'next/app'
import { useRouter } from "next/router";
import '../styles/main.css'
import Container from "../components/Container";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  return (
    <Container currentRoute={router.asPath}>
      <Component {...pageProps} />
    </Container>
  )
};

export default App;
