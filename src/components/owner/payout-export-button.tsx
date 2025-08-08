"use client";

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Payout } from '@/lib/types';

interface PayoutExportButtonProps {
    payouts: Payout[];
}

export function PayoutExportButton({ payouts }: PayoutExportButtonProps) {
    const handleExport = () => {
        if (payouts.length === 0) return;

        const headers = [
            "Booking ID",
            "Customer Name",
            "Gross Amount (NGN)",
            "Commission Rate (%)",
            "Commission Fee (NGN)",
            "Net Payout (NGN)",
            "Date",
            "Status"
        ];
        
        const rows = payouts.map(payout => [
            `"${payout.bookingId}"`,
            `"${payout.customerName}"`,
            payout.grossAmount,
            payout.commissionRate,
            payout.commissionFee,
            payout.netPayout,
            `"${payout.date}"`,
            `"${payout.status}"`
        ]);

        let csvContent = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "payouts-report.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button onClick={handleExport} variant="outline" disabled={payouts.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
        </Button>
    );
}
