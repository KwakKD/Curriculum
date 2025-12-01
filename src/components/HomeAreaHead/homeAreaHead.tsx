import type { ReactNode } from "react"

type HomeAreaHeadProps = {
    children: ReactNode
}

export default function HomeAreaHead({ children }: HomeAreaHeadProps) {
    return (
        <h4 style={{
            display: 'flex',
            justifyContent: 'center',
            margin: 10,
            fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif"
        }}>{children}</h4>
    )
}