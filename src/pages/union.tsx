import { schooldata } from "../data/schooldata"


export default function Union() {
    const list = Object.values(schooldata)

    return (
        <>
            <h1>SchoolName</h1>
            <ul>
                {list.map((school) => (
                    <li key={school.id}>
                        {school.name}
                    </li>
                ))}
            </ul>
        </>
    )
}