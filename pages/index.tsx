import { useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import NavigationUrls from "../components/Header/navigationUrls";

const Home: NextPage = () => {
  const router = useRouter();
  useEffect(
    () => {
      if (NavigationUrls.length > 0) {
        router.push(NavigationUrls[0].href);
      }
    },
    [router],
  );

  return (
    <></>
  );
}

export default Home;
