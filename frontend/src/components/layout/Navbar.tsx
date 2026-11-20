import { FaWatchmanMonitoring } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { logoutUser } from "../../features/auth/api/auth.api";

const Navbar = () => {
    const { isAuthenticated, user, setUser } = useAuth();

    const handleLogout = async () => {
        try {
            await logoutUser();
            setUser(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            alert(`Logout failed due to error: ${message}`);
        }
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[#262626] bg-[#0a0a0a]/95 text-white backdrop-blur">
            <div className="flex h-full items-center justify-between px-4 sm:px-6 md:px-8">

                <Link to="/" className="flex min-w-0 items-center gap-2 text-xl font-bold sm:gap-3 sm:text-2xl"
                >
                    <FaWatchmanMonitoring className="text-white" />
                    <span className="truncate">PULSE WATCH</span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-5">

                    {isAuthenticated && (
                        <span className="hidden max-w-40 truncate font-medium sm:inline">
                            Hi, {user?.name}
                        </span>
                    )}

                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="btn-danger"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="btn-primary"
                        >
                            Login
                        </Link>
                    )}

                </div>

            </div>
        </nav>
    );
}

export default Navbar;