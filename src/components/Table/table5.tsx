import styles from './table.module.css'
import Table5Cell from './table5cell'
import TableColgroup from './tableColgroup'
import TableThead from './tableHead'

export function Table5() {
    return (
        <table className={styles.table}>
            <TableColgroup/>
            <TableThead/>
            <Table5Cell/>
        </table>
    )
}