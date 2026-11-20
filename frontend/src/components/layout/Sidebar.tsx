import { Link, useLocation } from "react-router-dom";
import {
    FaBell,
    FaExclamationTriangle,
    FaServer,
} from "react-icons/fa";
import { useAuth } from "../../features/auth/hooks/useAuth";
 
const Sidebar = () => {

    const location = useLocation();
    const { user } = useAuth();

    const linkClass = (path: string) =>
        `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-400 ease-out
        ${
            location.pathname === path
                ? "bg-[#1f1f1f] text-white"
                : "text-[#888] hover:bg-[#171717] hover:text-[#ededed]"
        }`;
        

    return (
        <aside className="fixed left-0 top-16 z-40 flex h-auto w-full flex-col border-b border-[#262626] bg-[#0a0a0a] p-3 md:h-[calc(100vh-64px)] md:w-64 md:border-b-0 md:border-r">
            <div className="mb-3 flex items-center justify-between border-b border-[#262626] px-3 pb-3">
                <span className="truncate text-sm font-medium text-[#ededed]">
                    Monitor
                </span>
            </div>

            <nav className="flex gap-1 overflow-x-auto md:flex-col">
                <Link to="/" className={linkClass("/")}>
                    <FaServer className="text-base font-semibold" />
                    <span className="whitespace-nowrap text-base font-semibold">Endpoints</span>
                </Link>

                <Link to="/incidents" className={linkClass("/incidents")}>
                    <FaExclamationTriangle className="text-base font-semibold" />
                    <span className="whitespace-nowrap text-base font-semibold">Incidents</span>
                </Link>

                <Link to="/alerts" className={linkClass("/alerts")}>
                    <FaBell className="text-base font-semibold" />
                    <span className="whitespace-nowrap text-base font-semibold">Alerts</span>
                </Link>
            </nav>

            <div className="mt-3 hidden border-t border-[#262626] pt-3 md:mt-auto md:block">
                <div className="flex items-center gap-2 rounded-md px-2 py-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#404040] rounded-full text-lg font-semibold">
                        {user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#ededed]">
                            {user?.name ?? "User"}
                        </p>
                        <p className="truncate text-sm text-[#666]">
                            {user?.email ?? "Not signed in"}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar