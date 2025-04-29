import { ReactElement } from "react";
import { Sidebar } from "../misc/Sidebar";
import { Appbar } from "../misc/Appbar";
import styles from "../misc/index.module.scss";

export function DashboardLayout({ children }: { children: ReactElement }) {
    return (
        <>
            <Sidebar />
            <div className={styles["dashboard-layout"]}>
                <Appbar />
                <>{children}</>
            </div>
        </>
    );
}