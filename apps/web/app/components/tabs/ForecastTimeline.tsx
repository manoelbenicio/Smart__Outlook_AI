"use client";

import React, { useMemo } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine, Legend
} from "recharts";
import { useOfferStore } from "../../stores/useOfferStore";

export function ForecastTimeline() {
    const { offers, isLoading } = useOfferStore();

    const chartData = useMemo(() => {
        if (!offers.length) return [];

        // Aggregate offers by week based on start_date
        const weekMap = new Map<string, { active: number; closing: number }>();

        for (const offer of offers) {
            const sd = (offer as any).start_date ?? (offer as any).startDate;
            const ed = (offer as any).end_date ?? (offer as any).endDate;

            if (sd) {
                const d = new Date(sd);
                const weekStart = new Date(d);
                weekStart.setDate(d.getDate() - d.getDay());
                const key = weekStart.toISOString().split("T")[0];
                const entry = weekMap.get(key) || { active: 0, closing: 0 };
                entry.active += 1;
                weekMap.set(key, entry);
            }

            if (ed) {
                const d = new Date(ed);
                const weekStart = new Date(d);
                weekStart.setDate(d.getDate() - d.getDay());
                const key = weekStart.toISOString().split("T")[0];
                const entry = weekMap.get(key) || { active: 0, closing: 0 };
                entry.closing += 1;
                weekMap.set(key, entry);
            }
        }

        return Array.from(weekMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-16) // last 16 weeks
            .map(([week, counts]) => ({
                week: new Date(week).toLocaleDateString("en", { month: "short", day: "numeric" }),
                "New Offers": counts.active,
                "Closing Offers": counts.closing,
            }));
    }, [offers]);

    if (isLoading) {
        return <div className="animate-pulse bg-[var(--color-bg)] rounded w-full h-full min-h-[400px]" />;
    }

    if (!chartData.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-[var(--color-muted)]">
                No offer data — upload a CSV to see the forecast timeline.
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full">
            <h2 className="text-lg font-[var(--font-weight-bold)] text-[var(--color-primary)] mb-4">
                Offer Forecast Timeline
            </h2>
            <div className="flex-1 w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="colorClosing" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis dataKey="week" stroke="var(--color-muted)" tick={{ fontSize: 11 }} />
                        <YAxis stroke="var(--color-muted)" tick={{ fontSize: 11 }} allowDecimals={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--color-surface)",
                                borderColor: "var(--color-border)",
                                borderRadius: "var(--radius-card)",
                                color: "var(--color-text)",
                            }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <ReferenceLine y={10} label="Capacity" stroke="var(--color-danger)" strokeDasharray="3 3" />
                        <Area
                            type="monotone"
                            dataKey="New Offers"
                            stroke="var(--color-accent)"
                            fillOpacity={1}
                            fill="url(#colorNew)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="Closing Offers"
                            stroke="var(--chart-1)"
                            fillOpacity={1}
                            fill="url(#colorClosing)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
