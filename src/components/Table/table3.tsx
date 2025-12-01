import styles from './table.module.css'
import Table3Cell from './table3cell'
import TableColgroup from './tableColgroup'

export default function Table3() {
    return (
        <table className={styles.table}>
            <TableColgroup/>
            {/* <TableThead/> */}
            <Table3Cell/>
        </table>
    )
}