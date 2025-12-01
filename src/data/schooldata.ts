import Papa from 'papaparse';
import rawSchoolCsv from './rawSchoolCsv.csv?raw'

export interface SchoolInfo {
    id: string;        // 번호
    level: string;     // 급
    location: string;  // 지역
    name: string;      // 기관명
    homepage: string;  // 홈페이지
    type: string;      // 설립 (공립/사립 등)
    address: string;   // 주소
}

const parsed = Papa.parse<SchoolInfo>(rawSchoolCsv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
        const trimmed = header.trim();
        switch (trimmed) {
            case '번호':
                return 'id';
            case '급':
                return 'level';
            case '지역':
                return 'location';
            case '기관명':
                return 'name';
            case '홈페이지':
                return 'homepage';
            case '설립':
                return 'type';
            case '주소':
                return 'address';
            default:
                return trimmed; // 혹시 모를 예비용
        }
    }
})

const rows = parsed.data;

export const schooldata: Record<string, SchoolInfo> = {};

rows.forEach((row) => {
    if (!row.id) return;
    schooldata[row.id] = row;
})