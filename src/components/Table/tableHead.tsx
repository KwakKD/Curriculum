const TableThead = () => {
    return (
        <thead style={{fontWeight: "bold", backgroundColor: '#f0f0f0'}}>
            <tr style={{fontSize: 11, border: '1px solid #ccc'}}>
                <th >구분</th>
                <th>그룹</th>
                <th>교과군</th>
                <th>유형</th>
                <th>과목명</th>
                <th>기준<br/>학점</th>
                <th>운영<br/>학점</th>
                <th>1학년<br/> 1학기</th>
                <th>1학년<br/> 2학기</th>
                <th>2학년<br/> 1학기</th>
                <th>2학년<br/> 2학기</th>
                <th>3학년<br/> 1학기</th>
                <th>3학년<br/> 2학기</th>
                <th>삭제</th>
            </tr>
        </thead>
    )
}

export default TableThead;