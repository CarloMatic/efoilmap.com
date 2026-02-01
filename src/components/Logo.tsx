import React from 'react';

export default function Logo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary"
            >
                <path
                    d="M4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16V24C28 26.2091 26.2091 28 24 28H8C5.79086 28 4 26.2091 4 24V16Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M10 20L22 20"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M16 4V12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M16 20V28"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx="16" cy="16" r="2" fill="currentColor" />
            </svg>
            <span className="font-bold text-xl tracking-tight text-primary">eFoilMap.com</span>
        </div>
    );
}
