"use client";

import React from "react";
import { Question } from "@/types";
import { cn } from "@/lib/utils";
import { Check, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react";

interface QuestionRendererProps {
  question: Question;
  selectedAnswer: any;
  onAnswerChange: (answer: any) => void;
}

export function QuestionRenderer({
  question,
  selectedAnswer,
  onAnswerChange,
}: QuestionRendererProps) {
  switch (question.questionType) {
    // 1. Single Choice
    case "SINGLE_CHOICE": {
      return (
        <div className="space-y-3">
          {question.options?.map((option, idx) => {
            const isSelected = selectedAnswer === option.id;
            return (
              <label
                key={option.id}
                onClick={() => onAnswerChange(option.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border text-sm font-medium cursor-pointer transition-all",
                  isSelected
                    ? "border-blue-500 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20 dark:bg-blue-900/30 dark:text-blue-100"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{option.text}</span>
                </div>
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border flex items-center justify-center",
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 dark:border-slate-700"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      );
    }

    // 2. Multiple Choice
    case "MULTIPLE_CHOICE": {
      const selectedArray: string[] = Array.isArray(selectedAnswer)
        ? selectedAnswer
        : [];

      const toggleMulti = (id: string) => {
        if (selectedArray.includes(id)) {
          onAnswerChange(selectedArray.filter((item) => item !== id));
        } else {
          onAnswerChange([...selectedArray, id]);
        }
      };

      return (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 italic mb-2">
            Select ALL options that logically apply.
          </p>
          {question.options?.map((option, idx) => {
            const isChecked = selectedArray.includes(option.id);
            return (
              <label
                key={option.id}
                onClick={() => toggleMulti(option.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border text-sm font-medium cursor-pointer transition-all",
                  isChecked
                    ? "border-blue-500 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20 dark:bg-blue-900/30 dark:text-blue-100"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                      isChecked
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{option.text}</span>
                </div>
                <div
                  className={cn(
                    "h-5 w-5 rounded-md border flex items-center justify-center",
                    isChecked
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 dark:border-slate-700"
                  )}
                >
                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      );
    }

    // 3. Likert Scale (Big Five / Personality items)
    case "LIKERT_SCALE": {
      const likertOptions = [
        { val: "1", label: "Strongly Disagree" },
        { val: "2", label: "Disagree" },
        { val: "3", label: "Neutral" },
        { val: "4", label: "Agree" },
        { val: "5", label: "Strongly Agree" },
      ];

      return (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {likertOptions.map((opt) => {
              const isSelected = selectedAnswer === opt.val;
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => onAnswerChange(opt.val)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border text-center transition-all",
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/25"
                      : "border-slate-200 bg-white hover:border-blue-300 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  )}
                >
                  <span className="text-lg font-bold">{opt.val}</span>
                  <span className="text-[10px] mt-1 hidden sm:block font-medium">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between text-[11px] font-semibold text-slate-400 px-1">
            <span>← Strongly Disagree</span>
            <span>Strongly Agree →</span>
          </div>
        </div>
      );
    }

    // 4. Numerical Input
    case "NUMERICAL_INPUT": {
      return (
        <div className="space-y-3 max-w-sm pt-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Enter exact calculated numerical value:
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedAnswer || ""}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="e.g. 18"
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-bold text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Numbers only. Calculators or scratch paper are permitted for this section.
          </p>
        </div>
      );
    }

    // 5. Text Answer (Qualitative Reflection)
    case "TEXT_ANSWER": {
      return (
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Your Structured Workplace Response:
          </label>
          <textarea
            rows={5}
            value={selectedAnswer || ""}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Type your response with specific examples and outcome metrics..."
            className="w-full rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <p className="text-[11px] text-slate-400">
            Recommended length: 2 to 4 concise paragraphs.
          </p>
        </div>
      );
    }

    // 6. Image-Based / Abstract Pattern Matrix
    case "IMAGE_BASED": {
      return (
        <div className="space-y-5">
          {/* SVG Abstract Pattern Matrix Demonstration */}
          <div className="mx-auto flex max-w-md items-center justify-center rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-inner">
            <div className="grid grid-cols-3 gap-3">
              {[0, 45, 90, 45, 90, 135, 90, 135].map((deg, i) => (
                <div
                  key={i}
                  className="flex h-16 w-16 items-center justify-center rounded-lg border border-slate-700 bg-slate-800"
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 100 100"
                    style={{ transform: `rotate(${deg}deg)` }}
                    className="transition-transform"
                  >
                    <polygon
                      points="50,10 90,50 50,90 10,50"
                      fill={i % 2 === 0 ? "#3b82f6" : "#10b981"}
                      stroke="#ffffff"
                      strokeWidth="4"
                    />
                    <circle cx="50" cy="50" r="12" fill="#ffffff" />
                  </svg>
                </div>
              ))}
              {/* Target missing cell */}
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-amber-400 bg-amber-400/10 text-xl font-bold text-amber-400">
                ?
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Select the pattern that satisfies matrix rule [3, 3]:
            </span>
            {question.options?.map((option, idx) => {
              const isSelected = selectedAnswer === option.id;
              return (
                <label
                  key={option.id}
                  onClick={() => onAnswerChange(option.id)}
                  className={cn(
                    "flex items-center justify-between p-3.5 rounded-xl border text-sm font-medium cursor-pointer transition-all",
                    isSelected
                      ? "border-blue-500 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20 dark:bg-blue-900/30 dark:text-blue-100"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold dark:bg-slate-800">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option.text}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                </label>
              );
            })}
          </div>
        </div>
      );
    }

    // 7. Ranking Question
    case "RANKING": {
      const items = selectedAnswer || question.rankingItems || [];

      const moveItem = (index: number, direction: "up" | "down") => {
        const newItems = [...items];
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newItems.length) return;
        const [moved] = newItems.splice(index, 1);
        newItems.splice(targetIndex, 0, moved);
        onAnswerChange(newItems);
      };

      return (
        <div className="space-y-3 pt-2">
          <p className="text-xs text-slate-500">
            Use the arrows to rank items in priority order (1 = Highest Priority):
          </p>
          <div className="space-y-2">
            {items.map((item: any, idx: number) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {item.text}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, "up")}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                  >
                    <ChevronUp className="h-4 w-4 text-slate-600" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, "down")}
                    className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                  >
                    <ChevronDown className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 8. Matrix Question
    case "MATRIX": {
      const rows = question.matrixRows || ["Item 1", "Item 2"];
      const cols = question.matrixColumns || ["Low", "Medium", "High"];
      const matrixState = selectedAnswer || {};

      const handleCellSelect = (rowIdx: number, colIdx: number) => {
        onAnswerChange({
          ...matrixState,
          [rowIdx]: colIdx,
        });
      };

      return (
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-2.5 px-3 font-semibold text-slate-600">Statement</th>
                {cols.map((col, cIdx) => (
                  <th key={cIdx} className="py-2.5 px-3 text-center font-semibold text-slate-600">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {row}
                  </td>
                  {cols.map((_, cIdx) => {
                    const isSelected = matrixState[rIdx] === cIdx;
                    return (
                      <td key={cIdx} className="py-3 px-3 text-center">
                        <input
                          type="radio"
                          name={`matrix-row-${rIdx}`}
                          checked={isSelected}
                          onChange={() => handleCellSelect(rIdx, cIdx)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // 9. Situational Judgement
    case "SITUATIONAL_JUDGEMENT":
    default: {
      return (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 italic mb-2">
            Select the MOST effective and sustainable professional course of action.
          </p>
          {question.options?.map((option, idx) => {
            const isSelected = selectedAnswer === option.id;
            return (
              <label
                key={option.id}
                onClick={() => onAnswerChange(option.id)}
                className={cn(
                  "flex items-start justify-between p-4 rounded-xl border text-xs font-medium cursor-pointer transition-all",
                  isSelected
                    ? "border-blue-500 bg-blue-50/70 text-blue-950 ring-2 ring-blue-500/20 dark:bg-blue-900/30 dark:text-blue-100"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5",
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="leading-relaxed">{option.text}</span>
                </div>
                <div
                  className={cn(
                    "h-5 w-5 shrink-0 rounded-full border flex items-center justify-center mt-0.5 ml-2",
                    isSelected
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 dark:border-slate-700"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </label>
            );
          })}
        </div>
      );
    }
  }
}

