"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Footer } from "@/components/Footer";
import { ObfuscatedEmail } from "@/components/ui/ObfuscatedEmail";

const content = {
    en: {
        title: "Imprint",
        disclaimer: "Information according to § 5 TMG",
        legalForm: "Angelpower UG (limited liability)",
        address: "Belvedereallee 5, 52070 Aachen, Germany",
        registerHeading: "Register Entry",
        registerCourt: "Register Court: District Court Aachen",
        registerNumber: "Register Number: HRB 16897",
        contactHeading: "Contact",
        email: "Email: hi@efoilmap.com",
        phone: "Phone: +49 241 91880 1",
        representedBy: "Represented by",
        director: "Carlo Matic (Managing Director)",
        responsibleHeading: "Responsible for Content according to § 55 Abs. 2 RStV",
        responsiblePerson: "Carlo Matic",
        responsibleAddress: "Belvedereallee 5, 52070 Aachen, Germany",
        backToMap: "Back to Map"
    },
    de: {
        title: "Impressum",
        disclaimer: "Angaben gemäß § 5 TMG",
        legalForm: "Angelpower UG (haftungsbeschränkt)",
        address: "Belvedereallee 5, 52070 Aachen, Deutschland",
        registerHeading: "Registereintrag",
        registerCourt: "Registergericht: Amtsgericht Aachen",
        registerNumber: "Registernummer: HRB 16897",
        contactHeading: "Kontakt",
        email: "E-Mail: hi@efoilmap.com",
        phone: "Telefon: +49 241 91880 1",
        representedBy: "Vertreten durch",
        director: "Carlo Matic (Geschäftsführer)",
        responsibleHeading: "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV",
        responsiblePerson: "Carlo Matic",
        responsibleAddress: "Belvedereallee 5, 52070 Aachen, Deutschland",
        backToMap: "Zurück zur Karte"
    },
    es: {
        title: "Aviso Legal",
        disclaimer: "Información según § 5 TMG",
        legalForm: "Angelpower UG (responsabilidad limitada)",
        address: "Belvedereallee 5, 52070 Aquisgrán, Alemania",
        registerHeading: "Registro",
        registerCourt: "Tribunal de Registro: Tribunal de Distrito de Aquisgrán",
        registerNumber: "Número de Registro: HRB 16897",
        contactHeading: "Contacto",
        email: "Correo electrónico: hi@efoilmap.com",
        phone: "Teléfono: +49 241 91880 1",
        representedBy: "Representado por",
        director: "Carlo Matic (Director Gerente)",
        responsibleHeading: "Responsable del contenido según § 55 Abs. 2 RStV",
        responsiblePerson: "Carlo Matic",
        responsibleAddress: "Belvedereallee 5, 52070 Aquisgrán, Alemania",
        backToMap: "Volver al Mapa"
    },
    fr: {
        title: "Mentions Légales",
        disclaimer: "Informations conformes à l'article 5 de la TMG",
        legalForm: "Angelpower UG (responsabilité limitée)",
        address: "Belvedereallee 5, 52070 Aix-la-Chapelle, Allemagne",
        registerHeading: "Enregistrement",
        registerCourt: "Tribunal d'enregistrement : Tribunal d'instance d'Aix-la-Chapelle",
        registerNumber: "Numéro d'enregistrement : HRB 16897",
        contactHeading: "Contact",
        email: "E-mail : hi@efoilmap.com",
        phone: "Téléphone : +49 241 91880 1",
        representedBy: "Représenté par",
        director: "Carlo Matic (Directeur Général)",
        responsibleHeading: "Responsable du contenu selon § 55 Abs. 2 RStV",
        responsiblePerson: "Carlo Matic",
        responsibleAddress: "Belvedereallee 5, 52070 Aix-la-Chapelle, Allemagne",
        backToMap: "Retour à la Carte"
    },
    it: {
        title: "Note Legali",
        disclaimer: "Informazioni ai sensi del § 5 TMG",
        legalForm: "Angelpower UG (responsabilità limitata)",
        address: "Belvedereallee 5, 52070 Aquisgrana, Germania",
        registerHeading: "Registrazione",
        registerCourt: "Ufficio del registro: Tribunale di Aquisgrana",
        registerNumber: "Numero di registro: HRB 16897",
        contactHeading: "Contatti",
        email: "Email: hi@efoilmap.com",
        phone: "Telefono: +49 241 91880 1",
        representedBy: "Rappresentato da",
        director: "Carlo Matic (Amministratore Delegato)",
        responsibleHeading: "Responsabile del contenuto ai sensi del § 55 Abs. 2 RStV",
        responsiblePerson: "Carlo Matic",
        responsibleAddress: "Belvedereallee 5, 52070 Aquisgrana, Germania",
        backToMap: "Torna alla Mappa"
    },
    pt: {
        title: "Aviso Legal",
        disclaimer: "Informações de acordo com o § 5 TMG",
        legalForm: "Angelpower UG (responsabilidade limitada)",
        address: "Belvedereallee 5, 52070 Aachen, Alemanha",
        registerHeading: "Registro",
        registerCourt: "Tribunal de Registo: Tribunal de Comarca de Aachen",
        registerNumber: "Número de Registo: HRB 16897",
        contactHeading: "Contacto",
        email: "E-mail: hi@efoilmap.com",
        phone: "Telefone: +49 241 91880 1",
        representedBy: "Representado por",
        director: "Carlo Matic (Diretor Executivo)",
        responsibleHeading: "Responsável pelo conteúdo de acordo com o § 55 Abs. 2 RStV",
        responsiblePerson: "Carlo Matic",
        responsibleAddress: "Belvedereallee 5, 52070 Aachen, Alemanha",
        backToMap: "Voltar ao Mapa"
    },
    nl: {
        title: "Colofon",
        disclaimer: "Informatie volgens § 5 TMG",
        legalForm: "Angelpower UG (beperkte aansprakelijkheid)",
        address: "Belvedereallee 5, 52070 Aken, Duitsland",
        registerHeading: "Registratie",
        registerCourt: "Registratiekamer: Kantongerecht Aken",
        registerNumber: "Registratienummer: HRB 16897",
        contactHeading: "Contact",
        email: "E-mail: hi@efoilmap.com",
        phone: "Telefoon: +49 241 91880 1",
        representedBy: "Vertegenwoordigd door",
        director: "Carlo Matic (Algemeen Directeur)",
        responsibleHeading: "Verantwoordelijk voor de inhoud volgens § 55 lid 2 RStV",
        responsiblePerson: "Carlo Matic",
        responsibleAddress: "Belvedereallee 5, 52070 Aken, Duitsland",
        backToMap: "Terug naar Kaart"
    },
    pl: {
        title: "Nota Prawna",
        disclaimer: "Informacje zgodnie z § 5 TMG",
        legalForm: "Angelpower UG (z ograniczoną odpowiedzialnością)",
        address: "Belvedereallee 5, 52070 Akwizgran, Niemcy",
        registerHeading: "Wpis do rejestru",
        registerCourt: "Sąd rejestrowy: Sąd Rejonowy w Akwizgranie",
        registerNumber: "Numer rejestru: HRB 16897",
        contactHeading: "Kontakt",
        email: "E-mail: hi@efoilmap.com",
        phone: "Telefon: +49 241 91880 1",
        representedBy: "Reprezentowany przez",
        director: "Carlo Matic (Dyrektor Zarządzający)",
        responsibleHeading: "Odpowiedzialny za treść zgodnie z § 55 ust. 2 RStV",
        responsiblePerson: "Carlo Matic",
        responsibleAddress: "Belvedereallee 5, 52070 Akwizgran, Niemcy",
        backToMap: "Powrót do Mapy"
    },
    sv: {
        title: "Om webbplatsen (Impressum)",
        disclaimer: "Information enligt § 5 TMG",
        legalForm: "Angelpower UG (med begränsat ansvar)",
        address: "Belvedereallee 5, 52070 Aachen, Tyskland",
        registerHeading: "Registeruppgifter",
        registerCourt: "Registreringsdomstol: Tingsrätten i Aachen",
        registerNumber: "Registreringsnummer: HRB 16897",
        contactHeading: "Kontakt",
        email: "E-post: hi@efoilmap.com",
        phone: "Telefon: +49 241 91880 1",
        representedBy: "Representeras av",
        director: "Carlo Matic (Verkställande Direktör)",
        responsibleHeading: "Ansvarig för innehåll enligt § 55 Abs. 2 RStV",
        responsiblePerson: "Carlo Matic",
        responsibleAddress: "Belvedereallee 5, 52070 Aachen, Tyskland",
        backToMap: "Tillbaka till Kartan"
    }
};

export default function Imprint() {
    const { locale } = useLanguage();
    const t = (locale as string) in content ? content[locale as keyof typeof content] : content.en;

    return (
        <div className="h-full overflow-y-auto bg-background text-foreground relative flex flex-col justify-between">
            {/* Sticky Header Wrapper */}
            <div className="sticky top-0 bg-background/90 backdrop-blur-md border-b border-border/50 z-20 w-full py-4 px-8 flex justify-center">
                <div className="max-w-2xl w-full">
                    <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        {t.backToMap}
                    </Link>
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-8 pb-12 w-full flex-1 px-8 pt-8">
                <h1 className="text-3xl font-black tracking-tight">{t.title}</h1>

                <section className="space-y-4 text-sm leading-relaxed">
                    <p className="text-muted-foreground">{t.disclaimer}</p>

                    <div className="bg-card border border-border p-6 rounded-xl space-y-2">
                        <p className="font-bold text-foreground">{t.legalForm}</p>
                        <p className="text-muted-foreground">{t.address}</p>
                        
                        <div className="mt-4 pt-4 border-t border-border space-y-1">
                            <h3 className="font-semibold text-foreground">{t.registerHeading}</h3>
                            <p className="text-muted-foreground text-xs leading-normal">
                                {t.registerCourt}<br />
                                {t.registerNumber}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 bg-card border border-border p-6 rounded-xl">
                        <h2 className="text-lg font-bold text-foreground">{t.contactHeading}</h2>
                        <p className="text-muted-foreground">
                            {t.email.includes("hi@efoilmap.com") ? (
                                <>
                                    {t.email.split("hi@efoilmap.com")[0]}
                                    <ObfuscatedEmail email="hi@efoilmap.com" className="text-blue-500 hover:underline font-bold" />
                                </>
                            ) : t.email}
                        </p>
                        <p className="text-muted-foreground">{t.phone}</p>
                    </div>

                    <div className="space-y-2 bg-card border border-border p-6 rounded-xl">
                        <h2 className="text-lg font-bold text-foreground">{t.representedBy}</h2>
                        <p className="text-muted-foreground">{t.director}</p>
                    </div>

                    <div className="space-y-2 bg-card border border-border p-6 rounded-xl">
                        <h2 className="text-lg font-bold text-foreground leading-normal">{t.responsibleHeading}</h2>
                        <p className="font-semibold text-foreground">{t.responsiblePerson}</p>
                        <p className="text-muted-foreground">{t.responsibleAddress}</p>
                    </div>
                </section>
            </div>
            <Footer isStatic />
        </div>
    );
}
