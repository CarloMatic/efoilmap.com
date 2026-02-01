"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <Link href="/" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Map
                </Link>

                <h1 className="text-3xl font-bold">Privacy Policy / Datenschutzerklärung</h1>

                <section className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">1. Overview</h2>
                        <p className="text-muted-foreground">We take your privacy seriously. This website uses minimal cookies necessary for operation and third-party services (Mapbox) only with your explicit consent.</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">2. Mapbox</h2>
                        <p className="text-muted-foreground">We use Mapbox to display maps. When you activate the map, your IP address and other browser information may be transmitted to Mapbox. We block this transmission by default until you click "Enable Map".</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">3. Cookies</h2>
                        <p className="text-muted-foreground">We use local storage to save your consent preferences and language selection. No tracking pixels or analytics are used without consent.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
