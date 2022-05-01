import { useCallback, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { create, update } from "../../utils/api";
import Loading from "../../components/Loading";
import FormInput from "../../components/FormInput";
import DataCheckerById from "../../utils/dataCheckerById";

type BannerType = {
  id?: number,
  name: string,
  text: string,
  created_at?: string,
  updated_at?: string,
} | null

const Banner = ({ id, data }: { id: string, data: BannerType }) => {
  const router = useRouter();
  const [banner, setBanner] = useState<BannerType>(data);
  const [isLoading, setLoading] = useState<boolean>(true);

  const textOnChange = useCallback(
    (value: string) => {
      setBanner(prev => prev && ({
        ...prev,
        text: value,
      }));
    },
    [setBanner],
  );

  const createBanner = useCallback(
    async () => {
      await create(
        "banners",
        {
          "banner": {
            "name": banner?.name || "",
            "text": banner?.text || "",
          },
        },
        (result) => {
          router.push("/banners");
        },
        (error) => {},
      );
    },
    [banner, router],
  );

  const nameOnChange = useCallback(
    (value: string) => {
      setBanner(prev => prev && ({
        ...prev,
        name: value,
      }));
    },
    [setBanner],
  );

  const updateLoadingState = useCallback(
    (state: boolean) => {
      setLoading(state);
    },
    [setLoading],
  );

  const saveChanges = useCallback(
    async () => {
      if (!(banner?.name && banner?.text)) return;
      updateLoadingState(true);
      await update(
        "banners",
        id,
        {
          "banner": {
            "name": banner.name,
            "text": banner.text
          },
        },
        (result) => {
          router.push("/banners");
        },
        (error) => {},
      );
    },
    [banner, id, router, updateLoadingState],
  );

  useEffect(
    () => {
      updateLoadingState(false);
    },
    [updateLoadingState],
  );

  return (
    <div className="flex justify-center py-[20px]">
      <div className="flex flex-col gap-y-[20px] w-[90%]">
        <FormInput onChange={nameOnChange} title="Name" value={banner?.name || ""} />
        <FormInput onChange={textOnChange} title="Value"  value={banner?.text || ""} />
        <button onClick={banner?.id ? saveChanges : createBanner}>Save</button>
      </div>
      <Loading isLoading={isLoading} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id;
  return await DataCheckerById(
    id as string,
    "banners",
    {
      name: "",
      text: "",
    },
  );
}

export default Banner;
