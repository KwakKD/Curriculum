// import { useStatistics } from "../../hooks/useStatistics"

// export function StatisticsInPanel() {
//     const { allCredit_1, allCredit_3, statistics_KEM, statistics_subjectCreditCheck } = useStatistics()
//     const allcredit = allCredit_1 + allCredit_3
//     const maxKME = statistics_KEM['max']
//     const minKME = statistics_KEM['min']
//     const percentKME = (min: number, max: number) => {
//         if (min === 0 && max === 0) return null
//         if (min === max) {
//             const inpercent = ((max / allcredit) * 100).toFixed(1);
//             return (
//                 <div style={{ display: 'flex', gap: 10 }}>
//                     <h5>{max} / {allcredit} </h5>
//                     <h5 style={{ color: Number(inpercent) > 50 ? 'rgb(255,0,0)' : undefined }}>( {inpercent} %)</h5>
//                 </div>
//             )
//         } else {
//             const minpercent = ((min / allcredit) * 100).toFixed(1)
//             const maxpercent = ((max / allcredit) * 100).toFixed(1)
//             return (
//                 <div>
//                     <div style={{ display: 'flex', gap: 10 }}>
//                         <h5>최소학점 : {min} / {allcredit}</h5>
//                         <h5 style={{ color: Number(minpercent) > 50 ? 'rgb(255,0,0)' : undefined }}>( {minpercent} % )</h5>
//                     </div>
//                     <div style={{ display: 'flex', gap: 10 }}>
//                         <h5>최대학점 : {max} / {allcredit}</h5>
//                         <h5 style={{ color: Number(maxpercent) > 50 ? 'rgb(255,0,0)' : undefined }}>( {maxpercent} % )</h5>
//                     </div>
//                 </div>
//             )
//         }
//     }

//     const subjectGroupList = ['국어', '수학', '영어', '사회', '과학', '체육', '예술', '생활교양'];
//     const leastCredit = [8, 8, 8, 8, 10, 10, 10, 10];

//     return (
//         <>
//             <h5>점검내용</h5>
//             <h6>(추가, 공동 교육과정은 제외함.)</h6>
//             <h5>1. 국영수 시수 점검</h5>
//             {percentKME(minKME, maxKME)}
//             <h5>2. 과목별 필수학점 점검</h5>
//             <table>
//                 <colgroup>
//                     <col style={{ width: 100 }} />
//                     <col style={{ width: 50 }} />
//                     <col style={{ width: 50 }} />
//                     <col style={{ width: 50 }} />
//                 </colgroup>
//                 <thead>
//                     <tr>
//                         <td>과목</td>
//                         <td>최소</td>
//                         <td>최대</td>
//                         <td>필수</td>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {subjectGroupList.map((item, idx) => {
//                         return (
//                             <tr key={idx}>
//                                 <td style={{ color: statistics_subjectCreditCheck[item][0] < leastCredit[idx] ? 'rgb(255,0,0)' : undefined }}>{item}</td>
//                                 <td>{statistics_subjectCreditCheck[item][0]}</td>
//                                 <td>{statistics_subjectCreditCheck[item][1]}</td>
//                                 <td>{leastCredit[idx]}</td>
//                             </tr>
//                         )
//                     })}
//                 </tbody>
//             </table>
//         </>
//     )
// }

import styles from "./StatisticsInPanel.module.css";
import { useStatistics } from "../../hooks/useStatistics";

export function StatisticsInPanel() {
  const { allCredit_1, allCredit_3, statistics_KEM, statistics_subjectCreditCheck } = useStatistics();
  const allcredit = allCredit_1 + allCredit_3;
  const maxKME = statistics_KEM["max"];
  const minKME = statistics_KEM["min"];
  const subjectGroupList = ["국어", "수학", "영어", "사회", "과학", "체육", "예술", "생활교양"];
  const leastCredit = [8, 8, 8, 8, 10, 10, 10, 10];

  const percentKME = (min: number, max: number) => {
    if (min === 0 && max === 0) return null;
    const inPercent = (value: number) => ((value / allcredit) * 100).toFixed(1);
    if (min === max) {
      const percent = inPercent(max);
      return (
        <div className={styles.percentRow}>
          <h6>{max} / {allcredit}</h6>
          <h6 style={{ color: Number(percent) > 50 ? "rgb(255,0,0)" : undefined }}>
            ( {percent} % )
          </h6>
        </div>
      );
    }
    return (
      <div className={styles.percentBox}>
        <div className={styles.percentRow}>
          <h6>최소학점 : {min} / {allcredit}</h6>
          <h6 style={{ color: Number(inPercent(min)) > 50 ? "rgb(255,0,0)" : undefined }}>
            ( {inPercent(min)} % )
          </h6>
        </div>
        <div className={styles.percentRow}>
          <h6>최대학점 : {max} / {allcredit}</h6>
          <h6 style={{ color: Number(inPercent(max)) > 50 ? "rgb(255,0,0)" : undefined }}>
            ( {inPercent(max)} % )
          </h6>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h5 style={{ textAlign: 'center' }}>💡 점검내용</h5>
      <h6>(추가, 공동 교육과정은 제외함.)</h6>
      <h5>☑️ 국영수 시수 점검</h5>
      {percentKME(minKME, maxKME)}
      <h5>☑️ 과목별 필수학점 점검</h5>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>과목</th>
            <th>최소</th>
            <th>최대</th>
            <th>필수</th>
          </tr>
        </thead>
        <tbody>
          {subjectGroupList.map((item, idx) => {
            const [min, max] = statistics_subjectCreditCheck[item];
            return (
              <tr key={idx}>
                <td className={min < leastCredit[idx] ? styles.lowCredit : undefined}>{item}</td>
                <td>{min}</td>
                <td>{max}</td>
                <td>{leastCredit[idx]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
