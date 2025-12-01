import styles from './combobox.module.css';

type Option = {label: string | number; value: string | number };
type ComboProps = {
    comboboxList: (string|number|Option) [];
    value?: string | number;
    onChange?: (value: string) => void;
    disabled?: boolean;
}
export default function ComboBox({comboboxList, value, onChange, disabled=false}:ComboProps) {
    const options: Option[] = comboboxList.map(item => 
        typeof item === 'object' ? item as Option : {label: String(item), value: item}
    )
    return (
        <div className={styles.filter_item}>
            <select disabled={disabled} value={value ?? ''} className={styles.select} onChange={(e)=>onChange?.(e.target.value)}>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}