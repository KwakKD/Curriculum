import type React from 'react';
import styles from './OverallProgress.module.css'; // ✅ CSS Module import
import { useStatistics } from '../../hooks/useStatistics';
import { useSchoolJsonDataStore } from '../../store/SubjectStore';

export type OverallProgressProps = {
  total: number;
  completed: number;
  showLabel?: boolean;
};

export const OverallProgress: React.FC<OverallProgressProps> = ({
  total,
  completed,
  showLabel = true,
}) => {
  const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

  return (
    <div
      className={styles.overallProgress}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ width: '100%' }}
    >
      <div className={styles.progressTrack}>
        <div className={styles.progressBar} style={{ width: `${percent}%` }} />
      </div>
      {showLabel && (
        <p className={styles.progressLabel} aria-live="polite">
          {percent}% 완료 ({completed}/{total})
        </p>
      )}
    </div>
  );
};

export default function AllCreditProgress() {
  const { allCredit_1, allCredit_3 } = useStatistics();
  const year = useSchoolJsonDataStore.getState().year
  const CEA = useSchoolJsonDataStore.getState().user[year].CEA
  const CEA_creidt = CEA['1-1'] + CEA['1-2'] + CEA['2-1'] + CEA['2-2'] + CEA['3-1'] + CEA['3-2']
  const total = 192;
  const completed = allCredit_1 + allCredit_3 + CEA_creidt;

  return (
    <div className={styles.exampleContainer} style={{ width: '100%' }}>
      <h2 className={styles.exampleTitle}>📈 전체 진행률</h2>
      <OverallProgress total={total} completed={completed} />
    </div>
  );
}



// import React, { useMemo } from "react";

// export type ProgressBarProps = {
//     value?: number; // current value (for determinate)
//     max?: number; // default 100
//     indeterminate?: boolean; // true for unknown duration
//     showLabel?: boolean; // show percentage label text
//     height?: "sm" | "md" | "lg"; // visual size
//     rounded?: boolean; // rounded corners (default true)
//     trackClassName?: string; // extra classes for the track
//     barClassName?: string; // extra classes for the filled bar
//     labelFormatter?: (percent: number) => string; // custom label text
//     ariaLabel?: string; // accessible label
// };

// export const ProgressBar: React.FC<ProgressBarProps> = ({
//     value = 0,
//     max = 100,
//     indeterminate = false,
//     showLabel = false,
//     height = "md",
//     rounded = true,
//     trackClassName = "",
//     barClassName = "",
//     labelFormatter,
//     ariaLabel = "Progress",
// }) => {
//     const percent = useMemo(() => {
//         const p = Math.max(0, Math.min(1, value / (max || 100)));
//         return Math.round(p * 100);
//     }, [value, max]);

//     const heightCls =
//         height === "sm" ? "h-2" : height === "lg" ? "h-4" : "h-3";

//     return (
//         <div className="w-full" aria-label={ariaLabel}>
//             {/* Track */}
//             <div
//                 className={[
//                     "relative w-full bg-gray-200 dark:bg-gray-800 overflow-hidden",
//                     heightCls,
//                     rounded ? "rounded-full" : "",
//                     trackClassName,
//                 ].join(" ")}
//                 role="progressbar"
//                 aria-valuemin={0}
//                 aria-valuemax={max}
//                 aria-valuenow={indeterminate ? undefined : value}
//                 aria-busy={indeterminate}
//             >
//                 {/* Filled bar (determinate) */}
//                 {!indeterminate && (
//                     <div
//                         className={[
//                             "h-full bg-blue-500 dark:bg-blue-400 transition-[width] duration-300 ease-out",
//                             rounded ? "rounded-full" : "",
//                             barClassName,
//                         ].join(" ")}
//                         style={{ width: `${percent}%` }}
//                     />
//                 )}
//                 {/* Indeterminate shimmer */}
//                 {indeterminate && (
//                     <>
//                         <style>{`
//               @keyframes indeterminate-x {
//                 0% { left: -40%; right: 100%; }
//                 60% { left: 20%; right: -20%; }
//                 100% { left: 100%; right: -40%; }
//               }
//             `}</style>
//                         <div
//                             className={[
//                                 "absolute inset-y-0 bg-blue-500/80 dark:bg-blue-400/80",
//                                 rounded ? "rounded-full" : "",
//                             ].join(" ")}
//                             style={{
//                                 animation: "indeterminate-x 1.2s infinite cubic-bezier(0.4, 0, 0.2, 1)",
//                             }}
//                         />
//                     </>
//                 )}
//             </div>
//             {/* Visible percentage label */}
//             {showLabel && !indeterminate && (
//                 <div className="mt-1 text-xs text-gray-600 dark:text-gray-300" aria-live="polite">
//                     {labelFormatter ? labelFormatter(percent) : `${percent}%`}
//                 </div>
//             )}
//         </div>
//     );
// };

/**
 * StepProgress — for multi-step flows (e.g., 과목 입력 마법사)
 */
// export type StepProgressProps = {
//     steps: string[];
//     current: number; // 0-based index of current step
//     compact?: boolean; // small variant
// };

// export const StepProgress: React.FC<StepProgressProps> = ({ steps, current, compact = false }) => {
//     return (
//         <div className="w-full" aria-label="Step progress" role="list">
//             <div className="relative flex items-center">
//                 {/* connector line */}
//                 <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-800" />
//                 <ol className="relative z-10 flex w-full justify-between">
//                     {steps.map((label, i) => {
//                         const isDone = i < current;
//                         const isCurrent = i === current;
//                         return (
//                             <li key={i} className="flex flex-col items-center" role="listitem" aria-current={isCurrent ? "step" : undefined}>
//                                 <div
//                                     className={[
//                                         "flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium",
//                                         isDone ? "bg-green-500 text-white" : isCurrent ? "bg-blue-500 text-white" : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
//                                         compact ? "w-6 h-6 text-[10px]" : "",
//                                     ].join(" ")}
//                                 >
//                                     {isDone ? "✓" : i + 1}
//                                 </div>
//                                 {!compact && (
//                                     <span className="mt-2 text-xs text-center text-gray-700 dark:text-gray-300 max-w-[6rem]">
//                                         {label}
//                                     </span>
//                                 )}
//                             </li>
//                         );
//                     })}
//                 </ol>
//             </div>
//             {/* fill overlay for connector */}
//             <div className="mt-2">
//                 <ProgressBar value={(current / Math.max(1, steps.length - 1)) * 100} showLabel={false} height={compact ? "sm" : "md"} />
//             </div>
//         </div>
//     );
// };

// /**
//  * Example overlay for save/loading — blocks interaction while saving
//  */
// const SaveOverlay: React.FC<{ visible: boolean; percent?: number; indeterminate?: boolean }> = ({ visible, percent = 0, indeterminate }) => {
//     if (!visible) return null;
//     return (
//         <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
//             <div className="w-[min(92vw,480px)] rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
//                 <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">저장 중…</h3>
//                 <ProgressBar value={percent} indeterminate={indeterminate} showLabel={!indeterminate} height="lg" />
//                 {!indeterminate && (
//                     <p className="mt-2 text-sm text-gray-600 dark:text-gray-300" aria-live="polite">{Math.round(percent)}% 완료</p>
//                 )}
//             </div>
//         </div>
//     );
// };

/**
 * Default demo component showcasing three common subject-entry scenarios:
 * 1) Multi-step wizard (top step progress)
 * 2) Batch edit list (overall + per-row mini progress)
 * 3) Save overlay (blocking)
 */
// export default function ProgressBarDemo() {
//   // 1) Step wizard state
//   const [step, setStep] = useState(1);
//   const steps = ["기본정보", "세부정보", "검토 & 저장"];

//   // 2) Batch edit progress
//   const total = 8;
//   const [completed, setCompleted] = useState(3);
//   const overallPercent = (completed / total) * 100;

//   // 3) Save overlay
//   const [saving, setSaving] = useState(false);
//   const [savePct, setSavePct] = useState(0);

//   const simulateSave = () => {
//     setSaving(true);
//     setSavePct(0);
//     const start = Date.now();
//     const duration = 1800; // ms
//     const tick = () => {
//       const t = Date.now() - start;
//       const p = Math.min(1, t / duration);
//       setSavePct(5 + p * 95);
//       if (p < 1) requestAnimationFrame(tick);
//       else setTimeout(() => setSaving(false), 200);
//     };
//     requestAnimationFrame(tick);
//   };

//   return (
//     <div className="p-6 space-y-10 text-gray-900 dark:text-gray-100">
//       <header className="space-y-2">
//         <h1 className="text-2xl font-bold">React + TypeScript Progress Bar</h1>
//         <p className="text-sm text-gray-600 dark:text-gray-300">과목 입력/수정 화면에 바로 사용할 수 있는 선형(progress) 컴포넌트와 예시입니다.</p>
//       </header>

//       {/* 1) Step wizard */}
//       <section className="space-y-4">
//         <h2 className="text-lg font-semibold">1) 단계형 입력 마법사</h2>
//         <StepProgress steps={steps} current={step} />
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//           <button className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-800" onClick={() => setStep((s) => Math.max(0, s - 1))}>이전</button>
//           <div className="hidden sm:block" />
//           <button className="px-3 py-2 rounded-xl bg-blue-600 text-white" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>다음</button>
//         </div>
//       </section>

//       {/* 2) Batch edit list */}
//       <section className="space-y-4">
//         <h2 className="text-lg font-semibold">2) 여러 과목 일괄 수정</h2>
//         <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4 space-y-3">
//           <div className="flex items-center justify-between gap-4">
//             <span className="text-sm">전체 진행률</span>
//             <div className="min-w-[200px]">
//               <ProgressBar value={overallPercent} showLabel height="sm" />
//             </div>
//           </div>
//           <ul className="divide-y divide-gray-200 dark:divide-gray-800">
//             {Array.from({ length: total }).map((_, i) => {
//               const done = i < completed;
//               return (
//                 <li key={i} className="py-3 flex items-center justify-between gap-4">
//                   <div className="flex-1">
//                     <p className="font-medium">과목 {i + 1}</p>
//                     <p className="text-xs text-gray-600 dark:text-gray-400">상태: {done ? "수정완료" : "미완료"}</p>
//                   </div>
//                   <div className="w-32">
//                     <ProgressBar value={done ? 100 : 20} height="sm" showLabel={false} ariaLabel={`과목 ${i + 1} 진행률`} />
//                   </div>
//                 </li>
//               );
//             })}
//           </ul>
//           <div className="flex gap-2">
//             <button className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-800" onClick={() => setCompleted((c) => Math.max(0, c - 1))}>- 완료 감소</button>
//             <button className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-800" onClick={() => setCompleted((c) => Math.min(total, c + 1))}>+ 완료 증가</button>
//           </div>
//         </div>
//       </section>

//       {/* 3) Save overlay */}
//       <section className="space-y-3">
//         <h2 className="text-lg font-semibold">3) 저장/갱신 로딩</h2>
//         <div className="flex items-center gap-3">
//           <button className="px-4 py-2 rounded-xl bg-blue-600 text-white" onClick={simulateSave}>저장 시뮬레이션</button>
//           <div className="w-48">
//             <ProgressBar indeterminate ariaLabel="백그라운드 작업" />
//           </div>
//         </div>
//       </section>

//       <footer className="pt-4 text-xs text-gray-500">
//         Props: <code>value</code>, <code>max</code>, <code>indeterminate</code>, <code>showLabel</code>, <code>height</code>, <code>rounded</code>, <code>trackClassName</code>, <code>barClassName</code>, <code>labelFormatter</code>, <code>ariaLabel</code>
//       </footer>

//       <SaveOverlay visible={saving} percent={savePct} />
//     </div>
//   );
// }
