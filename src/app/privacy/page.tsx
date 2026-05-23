"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
    return (
        <div className="h-full overflow-y-auto bg-background text-foreground p-8 leading-relaxed">
            <div className="max-w-3xl mx-auto space-y-8">
                <Link href="/" className="flex items-center gap-2 text-primary hover:underline font-semibold">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Map
                </Link>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight">Privacy Policy / Datenschutzerklärung</h1>
                    <p className="text-xs text-muted-foreground">Last updated: May 23, 2026</p>
                </div>

                <section className="space-y-8 text-sm">
                    {/* 1. Controller */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">1. Data Controller (Verantwortlicher)</h2>
                        <p className="text-muted-foreground">
                            The entity responsible for processing data on this website in accordance with the General Data Protection Regulation (GDPR) is:
                        </p>
                        <div className="bg-card border border-border p-4 rounded-xl space-y-1 text-muted-foreground">
                            <p className="font-semibold text-foreground">Angelpower UG (haftungsbeschränkt)</p>
                            <p>Belvedereallee 5</p>
                            <p>52070 Aachen, Germany</p>
                            <p>Email: hi@efoilmap.com</p>
                            <p>Represented by: Carlo Matic</p>
                        </div>
                    </div>

                    {/* 2. Collection & Processing of Personal Data */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">2. Collection and Processing of Personal Data</h2>
                        <p className="text-muted-foreground">
                            We collect and process personal data only to the extent necessary to provide a functioning community platform. This includes:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>
                                <strong className="text-foreground">Authentication & Account Data:</strong> When you register or sign in via our passwordless magic links, we collect and store your email address. If you set up a profile, we store your self-selected username, bio, and custom avatar photo. 
                                <br /><span className="text-xs italic">Legal Basis: Art. 6 para. 1 lit. b GDPR (performance of a contract / user agreement).</span>
                            </li>
                            <li>
                                <strong className="text-foreground">User Generated Content (UGC):</strong> Spot coordinates, spot descriptions, spot amenities, and community reviews/ratings you post are saved in our database to compile the interactive community map. 
                                <br /><span className="text-xs italic">Legal Basis: Art. 6 para. 1 lit. b GDPR (contractual fulfillment of community services) and Art. 6 para. 1 lit. f GDPR (legitimate interest in preserving map data).</span>
                            </li>
                            <li>
                                <strong className="text-foreground">Technical Log Files:</strong> When accessing the site, your browser automatically transmits connection metadata (such as IP address, date/time, browser type, referrer URL) to our hosting servers for security analysis and spam prevention.
                                <br /><span className="text-xs italic">Legal Basis: Art. 6 para. 1 lit. f GDPR (legitimate interest in maintaining platform stability, security, and spam prevention).</span>
                            </li>
                        </ul>
                    </div>

                    {/* 3. Third-Party Services */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">3. Third-Party Processors & Data Transfer</h2>
                        <p className="text-muted-foreground">
                            To operate this platform, we rely on trusted infrastructure providers with whom we have signed Data Processing Agreements (DPA) in compliance with Art. 28 GDPR:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>
                                <strong className="text-foreground">Supabase, Inc. (Database & Auth):</strong> User credentials, profiles, spot logs, reviews, and uploaded photos are hosted securely on Supabase databases and storage buckets (hosted on EU-compliant infrastructure). Supabase manages our PKCE passwordless secure login.
                            </li>
                            <li>
                                <strong className="text-foreground">Mapbox, Inc. (Interactive Map):</strong> We use Mapbox to render geographical tiles. To prevent tracking, **Mapbox is fully blocked by default** until you explicitly give cookie consent. If you accept functional cookies, your IP address is sent to Mapbox to fetch maps.
                                <br /><span className="text-xs italic">Legal Basis: Art. 6 para. 1 lit. a GDPR (explicit consent via the cookie banner).</span>
                            </li>
                            <li>
                                <strong className="text-foreground">Google Translate API (Translations):</strong> We integrate Google Translate client-side to dynamically translate reviews and descriptions. This service is loaded lazily only when a user triggers translations of user-generated content.
                            </li>
                        </ul>
                    </div>

                    {/* 4. Cookies & LocalStorage */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">4. Cookies and Local Storage</h2>
                        <p className="text-muted-foreground">
                            We use local storage strictly to save your operational preferences. This includes:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><code className="text-xs text-foreground bg-muted px-1 py-0.5 rounded">efoilmap-consent</code>: Stores your cookie banner choice (true/false).</li>
                            <li><code className="text-xs text-foreground bg-muted px-1 py-0.5 rounded">efoilmap-lang</code>: Remembers your selected language route (EN/DE/ES/FR).</li>
                            <li><code className="text-xs text-foreground bg-muted px-1 py-0.5 rounded">efoilmap-intro-dismissed</code>: Remembers if you have read the onboarding message.</li>
                        </ul>
                        <p className="text-xs text-muted-foreground italic mt-2">
                            No third-party tracking pixels or behavioral advertising scripts are active on this website.
                        </p>
                    </div>

                    {/* 5. Account Deletion & Data Retention */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">5. Account Deletion and Data Retention</h2>
                        <p className="text-muted-foreground">
                            Your personal account data is kept as long as your profile exists. 
                        </p>
                        <p className="text-muted-foreground">
                            If you decide to delete your profile, we immediately trigger a cascading database command:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>All profile fields, avatar photos, and verifications (reviews) are **permanently destroyed**.</li>
                            <li>Spot listings you contributed are **anonymized** (authorship is set to null). This ensures that coordinate entries remain plotted to safeguard community integrity, while all links to your personal identity are completely severed.</li>
                        </ul>
                    </div>

                    {/* 6. Your Legal Rights */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">6. Your Rights as a Data Subject</h2>
                        <p className="text-muted-foreground">
                            Under the GDPR, you have the following rights regarding your personal data:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li><strong className="text-foreground">Art. 15 GDPR (Right of Access):</strong> Right to obtain confirmation and a copy of your stored data.</li>
                            <li><strong className="text-foreground">Art. 16 GDPR (Right to Rectification):</strong> Right to correct inaccurate data.</li>
                            <li><strong className="text-foreground">Art. 17 GDPR (Right to Erasure):</strong> Right to have your account and personal history deleted.</li>
                            <li><strong className="text-foreground">Art. 18 & 21 GDPR (Restriction & Objection):</strong> Right to restrict or object to processing.</li>
                            <li><strong className="text-foreground">Art. 20 GDPR (Data Portability):</strong> Right to export your personal data in a structured format.</li>
                            <li><strong className="text-foreground">Art. 77 GDPR (Complaint):</strong> Right to lodge a complaint with a competent data protection supervisory authority.</li>
                        </ul>
                        <p className="text-muted-foreground mt-2">
                            To exercise any of these rights, please email us directly at <span className="font-semibold text-foreground">hi@efoilmap.com</span>.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
