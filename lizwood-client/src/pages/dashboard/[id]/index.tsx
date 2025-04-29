import { ReactElement } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard";
import { NextPageWithLayout } from "@/utils/types";
// routes will be /dashboard/guildId/ ... maybe I can do a slug based on server name and id?
const DashboardPage: NextPageWithLayout = () => {
    return (
        <div className="page">Dashboard Page</div>
    )
}

DashboardPage.getLayout = function (page: ReactElement) {
    return <DashboardLayout>{page}</DashboardLayout>
}

export default DashboardPage;