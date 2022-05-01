import { FC } from "react";
import Link from "next/link"
import NavigationUrls from "./navigationUrls";

type HeaderType = {
  currentRoute: string,
}

const Header: FC<HeaderType> = ({
  currentRoute,
}) => (
  <div className="relative max-w-[300px] min-w-[200px] w-full bg-gray-200 h-full pt-[50px]">
    {
      NavigationUrls.map((navigationUrl, index) => (
        <span key={index}>
          <Link href={navigationUrl.href}>
            <div className={`px-[10px] py-[5px] mr-[20px] my-[5px] ${currentRoute === navigationUrl.href ? "bg-gray-500" : "bg-gray-300 text-gray-600"} hover:bg-gray-400 hover:text-white text-white rounded-tr-xl rounded-br-xl transition-all cursor-pointer`}>
              <span className="capitalize text-[18px] font-medium">
                {navigationUrl.name}
              </span>
            </div>
          </Link>
        </span>
      ))
    }
  </div>
);

export default Header;
