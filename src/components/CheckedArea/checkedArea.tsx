import type { ReactNode } from "react"

type CheckedAreaProps = {
    children: ReactNode;
}

export default function CheckedArea({ children }: CheckedAreaProps) {
    return (
        <div style={{
            height: 35,
            alignItems: 'center',
            display: 'flex', gap: 10,
            borderBottom: '1px solid #ddd',
            // backgroundColor: '#ffffffff',
            padding: '2px 16px',
            fontFamily: 'Pretendard',
            // fontfamily: 'Pretendard', 'Noto Sans KR', sans-serif;
        }}>
            {children}
        </div>
    )
}