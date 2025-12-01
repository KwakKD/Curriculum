import type { ReactNode } from "react"

type HeaderAreaProps = {
    children: ReactNode
}

export default function HeaderArea({ children }: HeaderAreaProps) {
    return (
        <div style={
            {
                height: 86,
                display: 'flex',
                borderBottom: '1px solid #ddd',
                backgroundColor: '#ffffffff'
            }}>
            {children}
        </div>
    )
}