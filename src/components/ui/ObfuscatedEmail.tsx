"use client";

import { useEffect, useState } from "react";

interface ObfuscatedEmailProps {
    email: string;
    subject?: string;
    className?: string;
    children?: React.ReactNode;
}

export function ObfuscatedEmail({ email, subject, className, children }: ObfuscatedEmailProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Fallback for SSR/Spam bots
        if (children) {
            return <span className={className}>{children}</span>;
        }
        const parts = email.split("@");
        if (parts.length === 2) {
            return (
                <span className={className}>
                    {parts[0]} [at] {parts[1].replace(".", " [dot] ")}
                </span>
            );
        }
        return <span className={className}>{email}</span>;
    }

    // Client-side: Beautiful, interactive link
    const [user, domain] = email.split("@");
    const mailtoHref = `mailto:${user}@${domain}${
        subject ? `?subject=${encodeURIComponent(subject)}` : ""
    }`;

    return (
        <a href={mailtoHref} className={className}>
            {children || `${user}@${domain}`}
        </a>
    );
}
