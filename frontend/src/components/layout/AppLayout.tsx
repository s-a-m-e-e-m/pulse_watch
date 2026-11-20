import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AppLayout = () => {
    return (
        <div className="min-h-screen">

            <Navbar />

            <Sidebar />

            <main className="mt-6 min-h-screen px-4 pb-8 pt-36 sm:px-6 md:ml-64 md:px-8 md:pt-24">
                <Outlet />
            </main>

        </div>
    );
};

export default AppLayout;