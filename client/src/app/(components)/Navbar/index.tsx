import { Menu, MoonIcon, Search, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
function Navbar() {
  const dispatch = useDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      {/* Search bar */}
      <div className="flex items-center  rounded bg-gray-100 dark:bg-gray-700">
        {isSidebarCollapsed ? (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          >
            <Menu className="h-8 w-8 dark:text-white" />
          </button> 
        ) : null}
        
        <div className="relative flex h-min w-[200px]">
          <Search className="abosulte mx-2 h-5 w-5 translate-y-1/2 transform cursor-pointer dark:text-white" />
          <input
            type="search"
            className="w-full rounded border-none bg-gray-100 p-2 placeholder-gray-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
            placeholder="Search..."
          ></input>
        </div>
      </div>
      {/* icons */}
      <div className="flex items-center">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={
            isDarkMode
              ? "rounded p-2 dark:hover:bg-gray-700"
              : "rounded p-2 hover:bg-gray-100"
          }
        >
          {isDarkMode ? (<Sun className="h-6 w-6 cursor-pointer dark:text-white" /> ) : (<MoonIcon className="h-6 w-6 cursor-pointer dark:text-white" />)}
        </button>
        <Link
          href="/settings"
            className={
            isDarkMode
              ? "h-min w-min rounded p-2 dark:hover:bg-gray-700"
              : "h-min w-min rounded p-2 hover:bg-gray-100"
          }
        >
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
          {/* <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block">

        </div> */}
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
