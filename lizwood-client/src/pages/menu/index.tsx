import { fetchMutualGuilds } from "@/utils/api";
import { PartialGuild } from "@/utils/types";
import { GetServerSidePropsContext, NextPage } from "next";
import { GuildMenuItem } from "@/components/guilds/GuildMenuItem";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

type Props = {
    guilds: PartialGuild[];
}
// destructure props.guilds into { guilds }
const MenuPage: NextPage<Props> = ( { guilds }) => {
    const router = useRouter();
    return (
        <div className="page">
            <div className={styles.container}>
                <h1 className={styles.title}>Please Select a Server</h1>
                {guilds.map((guild) => (
                        <div key={guild.id} onClick={() => router.push(`/dashboard/${guild.id}`)}>
                            <GuildMenuItem guild={guild} />
                        </div>
                ))}
            </div>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return fetchMutualGuilds(context);
}
export default MenuPage;