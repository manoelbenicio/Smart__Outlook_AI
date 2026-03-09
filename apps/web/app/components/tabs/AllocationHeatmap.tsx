"use client";

import React, { useMemo } from "react";
import { useOfferStore } from "../../stores/useOfferStore";
import { motion } from "motion/react";

function getAllocColor(value: number): string {
    if (value <= 0) return "var(--color-bg)";
    if (value <= 0.3) return "var(--color-success)";
    if (value <= 0.6) return "var(--chart-2)";
    if (value <= 0.9) return "var(--color-warning)";
    return "var(--color-danger)";
}

function getAllocOpacity(value: number): number {
    if (value <= 0) return 0.1;
    return Math.min(0.3 + value * 0.7, 1);
}

export function AllocationHeatmap() {
    const { allocations, isLoading } = useOfferStore();

    const { architects, dates, grid } = useMemo(() => {
        if (!allocations.length) return { architects: [], dates: [], grid: new Map() };

        const archSet = new Set<string>();
        const dateSet = new Set<string>();
        const grid = new Map<string, { value: number; overloaded: boolean; details: { offerId: string; role: string; weight: number }[] }>();

        for (const alloc of allocations) {
            const name = (alloc as any).architect_name ?? (alloc as any).architectName ?? "";
            const date = (alloc as any).date ?? "";
            const total = (alloc as any).total_allocation ?? (alloc as any).totalAllocation ?? 0;
            const overloaded = (alloc as any).is_overloaded ?? (alloc as any).isOverloaded ?? false;
            const details = (alloc as any).allocations ?? (alloc as any).details ?? [];

            archSet.add(name);
            dateSet.add(date);
            grid.set(`${name}|${date}`, {
                value: total,
                overloaded,
                details: details.map((d: any) => ({
                    offerId: d.offer_id ?? d.offerId ?? "",
                    role: d.role ?? "",
                    weight: d.weight ?? 0,
                })),
            });
        }

        const architects = Array.from(archSet).sort();
        const dates = Array.from(dateSet).sort();

        return { architects, dates, grid };
    }, [allocations]);

    if (isLoading) {
        return <div className="animate-pulse bg-[var(--color-bg)] rounded w-full h-full min-h-[400px]" />;
    }

    if (!allocations.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-[var(--color-muted)]">
                No allocation data — upload a CSV to get started.
            </div>
        );
    }

    // Limit visible dates to the last 30 for readability
    const visibleDates = dates.slice(-30);

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-[var(--font-weight-bold)] text-[var(--color-primary)]">
                    Allocation Heatmap
                </h2>
                <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "var(--color-success)", opacity: 0.7 }} /> ≤30%</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "var(--chart-2)", opacity: 0.7 }} /> ≤60%</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "var(--color-warning)", opacity: 0.7 }} /> ≤90%</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: "var(--color-danger)", opacity: 0.9 }} /> &gt;90%</span>
                </div>
            </div>

            <div className="flex-1 w-full overflow-auto rounded border border-[var(--color-border)]">
                <table className="w-full border-collapse text-xs">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-10 bg-[var(--color-surface)] border-b border-r border-[var(--color-border)] px-3 py-2 text-left text-[var(--color-muted)] font-medium min-w-[140px]">
                                Architect
                            </th>
                            {visibleDates.map((d) => (
                                <th
                                    key={d}
                                    className="border-b border-[var(--color-border)] px-1 py-2 text-center text-[var(--color-muted)] font-normal whitespace-nowrap"
                                    style={{ minWidth: 36 }}
                                >
                                    {new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" })}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {architects.map((arch, rowIdx) => (
                            <tr key={arch}>
                                <td className="sticky left-0 z-10 bg-[var(--color-surface)] border-r border-b border-[var(--color-border)] px-3 py-1.5 font-medium text-[var(--color-text)] truncate max-w-[160px]">
                                    {arch}
                                </td>
                                {visibleDates.map((d) => {
                                    const cell = grid.get(`${arch}|${d}`);
                                    const value = cell?.value ?? 0;
                                    const overloaded = cell?.overloaded ?? false;
                                    return (
                                        <td
                                            key={d}
                                            className="border-b border-[var(--color-border)] p-0.5"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: rowIdx * 0.02, duration: 0.2 }}
                                                className="group relative w-full aspect-square rounded-sm flex items-center justify-center cursor-default"
                                                style={{
                                                    backgroundColor: getAllocColor(value),
                                                    opacity: getAllocOpacity(value),
                                                    outline: overloaded ? "2px solid var(--color-danger)" : "none",
                                                    outlineOffset: -1,
                                                }}
                                                title={`${arch} | ${d} — ${(value * 100).toFixed(0)}%${overloaded ? " ⚠ OVERLOADED" : ""}`}
                                            >
                                                {value > 0 && (
                                                    <span className="text-[9px] font-bold text-[var(--color-text)] opacity-70">
                                                        {(value * 100).toFixed(0)}
                                                    </span>
                                                )}
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md shadow-lg p-2 z-50 min-w-[180px] text-left">
                                                    <p className="font-bold text-[var(--color-primary)]">{arch}</p>
                                                    <p className="text-[var(--color-muted)]">{d}</p>
                                                    <p className="mt-1">Total: <strong>{(value * 100).toFixed(0)}%</strong>
                                                        {overloaded && <span className="ml-1 text-[var(--color-danger)]">⚠ Overloaded</span>}
                                                    </p>
                                                    {cell?.details && cell.details.length > 0 && (
                                                        <ul className="mt-1 space-y-0.5 border-t border-[var(--color-border)] pt-1">
                                                            {cell.details.map((det, i) => (
                                                                <li key={i} className="flex justify-between">
                                                                    <span className="truncate mr-2">{det.offerId}</span>
                                                                    <span className="text-[var(--color-accent)] font-medium">{det.role} {(det.weight * 100).toFixed(0)}%</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
