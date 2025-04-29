import { FC } from "react";
import Image from "next/image";
import { PartialGuild } from "@/utils/types"
import styles from './index.module.scss';
type Props = {
    guild: PartialGuild
}

export const GuildMenuItem: FC<Props> = ({ guild }) => {
    let iconURL;
    if(guild.icon != null) iconURL = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
    else iconURL = "https://placecats.com/millie_neo/300/200.png"
    return (
    <div className={styles.container}>
        <Image
            src = {iconURL}
            height={55}
            width={55}
            className={styles.image}
            alt={guild.name}
        />
        <p>{guild.name}</p>
    </div>)
}