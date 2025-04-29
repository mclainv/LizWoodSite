import { useRouter } from 'next/router';
import styles from './index.module.scss'
import { RiMenu3Line } from 'react-icons/ri'
export const Appbar = () => {
    const router = useRouter();
    return (
        <div className = {styles.appbar}>
            <div className={styles.menu} onClick={() => router.push('/menu')}>
                <RiMenu3Line size={65}/>
                <p>Menu</p>
            </div>
            <div>
                <p>{"Music Together"}</p>
            </div>
        </div>
    );
}