import { useState, type ReactNode, type DragEvent} from "react";
import styles from './listbox.module.css';

type ListBoxProps<T = string | number> = {
    items: readonly T[];
    selected?: T | null;
    onSelect?: (value: T) => void;
    renderItem?: (item: T) => ReactNode;
    checkedSet?: ReadonlySet<T> | null;
    onCheckedChange?: (next: Set<T>) => void;
    draggable?: boolean;
}

export default function ListBox<T extends string | number>({ items, selected = null, onSelect, renderItem, checkedSet, onCheckedChange, draggable = true }: ListBoxProps<T>) {
    const [internalChecked, setInternalChecked] = useState<Set<T>>(new Set());
    const checked = checkedSet ?? internalChecked;

    const toggle = (item: T) => {
        const next = new Set(checked);
        next.has(item) ? next.delete(item) : next.add(item);
        onCheckedChange ? onCheckedChange(next) : setInternalChecked(next);
    };

    const handleDragStart = (e: DragEvent<HTMLUListElement>) => {
        if (!draggable || !e.dataTransfer) return;
        // 1) 선택 항목 수집 (상태에서)
        const selected = Array.from(checked);
        // 2) 드래그 데이터로 담기
        e.dataTransfer.setData("text/plain", JSON.stringify(selected));
        // 3) 프리뷰 엘리먼트 생성 후 setDragImage
        const dragPreview = document.createElement("div");
        dragPreview.textContent = `${selected.length}개 과목`;
        dragPreview.style.cssText = "position:absolute; top:-1000px; padding:6px 10px; background:black; color:white; font-size:14px; border-radius:6px;";
        document.body.appendChild(dragPreview);
        e.dataTransfer.setDragImage(dragPreview, 0, 0);
        // 4) 한 프레임 뒤 제거 (브라우저가 이미지 캡처한 뒤)
        setTimeout(() => document.body.removeChild(dragPreview), 0);
    }


    return (
        <ul className={styles.listbox} draggable={draggable} onDragStart={handleDragStart}>
            {items.map((item) => {
                const isSelected = item === selected;
                const isChecked = checked.has(item);
                return (
                    <li draggable key={item} className={`${styles.item} ${isSelected ? styles.selected : ""}`} onClick={() => onSelect?.(item)}>
                        <label className={styles.label}>
                            <input type="checkbox" value={String(item)} checked={isChecked} onChange={(e) => {
                                e.stopPropagation();
                                toggle(item);
                            }} />
                            {renderItem ? renderItem(item) : String(item)}
                        </label>
                    </li>)
            })}
        </ul>
    )
}