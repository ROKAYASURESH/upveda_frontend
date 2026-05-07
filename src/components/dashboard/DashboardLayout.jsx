import MobSidebar from "./includes/MobSidebar"
import Sidebar from "./includes/Sidebar"
import Navbar from "./includes/Navbar"
import Footer from "./includes/Footer"
import { Outlet } from "react-router-dom"
import { LoadingProvider } from "../../context/LoadingContext"
import { useEffect } from "react"
import { useDispatch } from 'react-redux';
import { fetchUserRolesPermissions } from "../../store/auth"

export default function DashboardLayout() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchUserRolesPermissions());
    }, [dispatch]);

    return (
        <>
            <LoadingProvider>
                <MobSidebar />
                <Sidebar />
                <main className="content">
                    <Navbar />
                    <Outlet />
                    <Footer />
                </main>
            </LoadingProvider>
        </>
    )
}