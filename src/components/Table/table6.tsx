import TableColgroup from "./tableColgroup";
import TableThead from "./tableHead";
import styles from './table.module.css'
import Table6Cell from "./table6cell";

export function Table6() {
    return (
        <table className={styles.table}>
            <TableColgroup/>
            <TableThead/>
            <Table6Cell/>
        </table>
    )
}