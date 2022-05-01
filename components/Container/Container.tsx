import { FC, ReactElement } from "react";
import Header from "../Header";

type ContainerPropTypes = {
  currentRoute: string,
  children: ReactElement,
}

const Container: FC<ContainerPropTypes> = ({
  currentRoute,
  children,
}) => (
  <main className="flex absolute top-0 left-0 right-0 bottom-0">
    <Header currentRoute={currentRoute} />
    <div className="w-full bg-gray-50 h-full">
      {
        children
      }
    </div>
  </main>
);

export default Container;
