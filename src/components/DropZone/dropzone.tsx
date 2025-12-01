import { useState, type HTMLAttributes } from "react";

type DropZoneProps = {
    label: string;
    value: string;
    onDropText?: (textList: string[], value: string) => void;   // 드래그한 텍스트(여러 개) 수신
} & HTMLAttributes<HTMLDivElement>;


export default function DropZone({ label, value, onDropText, ...rest }: DropZoneProps) {
    const [isOver, setIsOver] = useState(false);

    return (
        <div
            {...rest}
            onDragOver={(e) => {
                e.preventDefault(); //드롭허용
                setIsOver(true);
            }}
            onDragLeave={() => setIsOver(false)}
            onDrop={(e) => {
                e.preventDefault();
                setIsOver(false);
                const items = Array.from(e.dataTransfer.items ?? []);
                const texts: string[] = [];

                items.forEach((it) => {
                    it.getAsString((s) => {
                        if (s.trim()) {
                            const adds = JSON.parse(s);
                            texts.push(...adds);
                            onDropText?.([JSON.parse(s)], value)
                        }
                    })
                })

                if (items.length === 0) {
                    const fallback = e.dataTransfer.getData('text');
                    if (fallback && !texts.includes(fallback)) {
                        texts.push(fallback);
                        onDropText?.([fallback], value);
                    }
                }
            }}
            key={value}
            style={{
                border: "1px dashed #838383ff",
                borderRadius: 15,
                padding: 8,
                textAlign: "center",
                transition: "0.15s",
                // background: isOver ? "#cde6feff" : "transparent",
                background: isOver ? "#b2daffff" : 'hsla(60, 100%, 99%, 1.00)',
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
            }}
            role="button"
            tabIndex={0}
        >
            {label}
        </div>
    )
}