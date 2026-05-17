"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Imprint() {
    return (
        <div className="h-full overflow-y-auto bg-background text-foreground p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <Link href="/" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Map
                </Link>

                <h1 className="text-3xl font-bold">Imprint / Impressum</h1>

                <section className="space-y-4">
                    <p className="text-sm text-muted-foreground">Information according to § 5 TMG</p>

                    <div className="bg-card border border-border p-6 rounded-lg space-y-2">
                        <p className="font-bold">Angelpower UG / efoilmap.com</p>
                        <p>Belvedereallee 5</p>
                        <p>52070 Aachen</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Contact</h2>
                        <p>Email: hi@efoilmap.com</p>
                        <p>Phone: +49 241 91880 1</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Responsible for Non-User Generated Content</h2>
                        <p>Carlo Matic</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
