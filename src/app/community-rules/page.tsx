"use client";

import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CommunityRulesPage() {
    const { locale } = useLanguage();

    const content = {
        en: {
            title: "Community Guidelines",
            intro: "Welcome to eFoilMap! To keep this platform safe and useful for everyone, please follow these guidelines:",
            rules: [
                { title: "Respect Local Laws", text: "Only add spots where eFoiling is legally permitted or officially tolerated. Do not add spots in nature reserves or forbidden zones." },
                { title: "Be Respectful", text: "Treat all community members with respect. Harassment, hate speech, or inappropriate language in reviews or bios will not be tolerated." },
                { title: "Provide Accurate Information", text: "When adding a spot or review, be as precise as possible regarding parking, entry points, and local hazards." },
                { title: "One Review Per Spot", text: "You can only leave one review per spot to keep ratings fair. You may update your review at any time." },
                { title: "Respect Privacy", text: "Do not upload photos containing identifiable faces of strangers without their consent." }
            ],
            outro: "Violating these rules may result in your account being suspended and your contributions removed. Let's build a great community together!"
        },
        de: {
            title: "Community-Richtlinien",
            intro: "Willkommen bei eFoilMap! Damit diese Plattform für alle sicher und nützlich bleibt, befolge bitte diese Regeln:",
            rules: [
                { title: "Lokale Gesetze respektieren", text: "Trage nur Spots ein, an denen das eFoilen legal erlaubt oder offiziell geduldet ist. Trage keine Spots in Naturschutzgebieten oder Sperrzonen ein." },
                { title: "Respektvoller Umgang", text: "Behandle alle Community-Mitglieder mit Respekt. Belästigung, Hassrede oder unangemessene Sprache in Bewertungen werden nicht toleriert." },
                { title: "Genaue Informationen", text: "Sei beim Hinzufügen von Spots oder Bewertungen so präzise wie möglich bezüglich Parkplätzen, Einstiegen und Gefahren." },
                { title: "Eine Bewertung pro Spot", text: "Du kannst nur eine Bewertung pro Spot hinterlassen. Du kannst deine Bewertung jedoch jederzeit aktualisieren." },
                { title: "Privatsphäre respektieren", text: "Lade keine Fotos hoch, auf denen fremde Personen eindeutig erkennbar sind, ohne deren Zustimmung." }
            ],
            outro: "Verstöße gegen diese Regeln können zur Sperrung deines Kontos und zur Löschung deiner Beiträge führen. Lass uns gemeinsam eine tolle Community aufbauen!"
        },
        es: {
            title: "Reglas de la Comunidad",
            intro: "¡Bienvenido a eFoilMap! Para mantener esta plataforma segura y útil para todos, por favor sigue estas pautas:",
            rules: [
                { title: "Respeta las Leyes Locales", text: "Añade solo lugares donde el eFoil esté permitido legalmente o tolerado oficialmente. No añadas lugares en reservas naturales." },
                { title: "Sé Respetuoso", text: "Trata a todos los miembros con respeto. No se tolerará el acoso, el discurso de odio ni el lenguaje inapropiado." },
                { title: "Proporciona Información Precisa", text: "Al añadir un lugar o reseña, sé lo más preciso posible sobre el aparcamiento, los puntos de entrada y los peligros." },
                { title: "Una Reseña por Lugar", text: "Solo puedes dejar una reseña por lugar para mantener las calificaciones justas. Puedes actualizar tu reseña en cualquier momento." },
                { title: "Respeta la Privacidad", text: "No subas fotos que contengan caras identificables de extraños sin su consentimiento." }
            ],
            outro: "La violación de estas reglas puede resultar en la suspensión de tu cuenta. ¡Construyamos una gran comunidad juntos!"
        },
        fr: {
            title: "Règles de la Communauté",
            intro: "Bienvenue sur eFoilMap ! Pour garder cette plateforme sûre et utile pour tous, veuillez suivre ces directives :",
            rules: [
                { title: "Respectez les Lois Locales", text: "N'ajoutez que des spots où l'eFoil est légalement autorisé ou officiellement toléré. N'ajoutez pas de spots dans des réserves naturelles." },
                { title: "Soyez Respectueux", text: "Traitez tous les membres avec respect. Le harcèlement ou les propos haineux ne seront pas tolérés." },
                { title: "Fournissez des Informations Précises", text: "Soyez aussi précis que possible concernant le stationnement, les points d'entrée et les dangers locaux." },
                { title: "Un Avis par Spot", text: "Vous ne pouvez laisser qu'un seul avis par spot. Vous pouvez mettre à jour votre avis à tout moment." },
                { title: "Respectez la Vie Privée", text: "Ne téléchargez pas de photos contenant des visages identifiables d'inconnus sans leur consentement." }
            ],
            outro: "La violation de ces règles peut entraîner la suspension de votre compte. Construisons une belle communauté ensemble !"
        }
    };

    const currentContent = content[locale] || content.en;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-12 px-4 sm:px-6">
            <div className="max-w-2xl w-full">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Map
                </Link>

                <h1 className="text-3xl font-bold mb-6 text-foreground">{currentContent.title}</h1>
                <p className="text-foreground/80 mb-8 leading-relaxed">
                    {currentContent.intro}
                </p>

                <div className="space-y-6">
                    {currentContent.rules.map((rule, idx) => (
                        <div key={idx} className="bg-muted/30 p-5 rounded-xl border border-border">
                            <h2 className="text-lg font-bold mb-2 text-foreground">{idx + 1}. {rule.title}</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {rule.text}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <p className="text-sm text-blue-400 font-medium">
                        {currentContent.outro}
                    </p>
                </div>
            </div>
        </div>
    );
}
