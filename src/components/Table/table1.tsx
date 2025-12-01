import styles from './table.module.css'
import Table1Cell from './table1cell'
import TableColgroup from './tableColgroup'
import TableThead from './tableHead'

export default function Table1() {
    return (
        <table className={styles.table}>
            <TableColgroup />
            <TableThead />
            <Table1Cell/>
        </table>
    )
}