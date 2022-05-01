import { FC } from "react";
import Image from "next/image";

type LoadingPropType = {
  isLoading: boolean,
}

const Loading: FC<LoadingPropType> = ({
  isLoading,
}) => {
  if (!isLoading) return <></>;

  return (
    <div className="flex justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-gray-600 bg-opacity-50">
      <div className="w-full flex justify-center bg-white py-[10px]">
        <Image
          src="/loading.gif"
          alt="loading"
          height={141}
          width={287}
        />
      </div>
    </div>
  );
};

export default Loading;
