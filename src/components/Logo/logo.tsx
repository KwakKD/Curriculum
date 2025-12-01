export default function Logo() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            {/* <!-- 연결선 --> */}
            <line x1="60" y1="140" x2="100" y2="80" stroke="#009999" strokeWidth="4" />
            <line x1="100" y1="80" x2="150" y2="60" stroke="#009999" strokeWidth="4" />
            <line x1="100" y1="80" x2="130" y2="130" stroke="#009999" strokeWidth="4" />
            <line x1="60" y1="140" x2="130" y2="130" stroke="#009999" strokeWidth="4" />
            <line x1="60" y1="140" x2="70" y2="90" stroke="#009999" strokeWidth="4" />

            {/* <!-- 연결점 --> */}
            <circle cx="60" cy="140" r="7" fill="#009999" />
            <circle cx="100" cy="80" r="7" fill="#009999" />
            <circle cx="150" cy="60" r="7" fill="#009999" />
            <circle cx="130" cy="130" r="7" fill="#009999" />
            <circle cx="70" cy="90" r="7" fill="#2e0099ff" />

            {/* <!-- 텍스트 --> */}
            <text x="100" y="180" fontSize="16" textAnchor="middle" fontFamily="Noto Sans, sans-serif" fill="#000">
                Connecting Space
            </text>
            <text x="100" y="195" fontSize="10" textAnchor="middle" fontFamily="Noto Sans, sans-serif" fill="#464646ff">
                학교를 잇다, 배움을 엮다.
            </text>
        </svg>

    )
}