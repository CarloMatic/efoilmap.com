"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Imprint() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <Link href="/" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Map
                </Link>

                <h1 className="text-3xl font-bold">Imprint / Impressum</h1>

                <section className="space-y-4">
                    <p className="text-sm text-muted-foreground">Information according to § 5 TMG</p>

                    <div className="bg-card border border-border p-6 rounded-lg space-y-2">
                        <p className="font-bold">Villa Carma / efoilmap.com</p>
                        <p>Address Line 1</p>
                        <p>12345 City, Country</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Contact</h2>
                        <p>Email: hi@efoilmap.com</p>
                        <p>Phone: +1 234 567 890</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Responsible for Content</h2>
                        <p>Name Surname</p>
                        <p>Address (if different)</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
