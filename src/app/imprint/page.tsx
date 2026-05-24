"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Footer } from "@/components/Footer";

const content = {
    en: {
        title: "Imprint",
        legalForm: "Angelpower UG (limited liability)",
        address: "Belvedereallee 5, 52070 Aachen, Germany",
        register: "Register Court: District Court Aachen",
        registerNumber: "Register Number: HRB 16897",
        contact: "Contact",
        email: "Email: hi@efoilmap.com",
        phone: "Phone: +49 241 91880 1",
        representedBy: "Represented By",
        director: "Carlo Matic (Managing Director)",
        responsible: "Responsible for Content (§ 55 Abs. 2 RStV)",
        responsiblePerson: "Carlo Matic",
        backToMap: "Back to Map",
        disclaimer: "Information according to § 5 TMG"
    },
    de: {
        title: "Impressum",
        legalForm: "Angelpower UG (haftungsbeschränkt)",
        address: "Belvedereallee 5, 52070 Aachen",
        register: "Registergericht: Amtsgericht Aachen",
        registerNumber: "Registernummer: HRB 16897",
        contact: "Kontakt",
        email: "E-Mail: hi@efoilmap.com",
        phone: "Telefon: +49 241 91880 1",
        representedBy: "Vertreten durch",
        director: "Carlo Matic (Geschäftsführer)",
        responsible: "Verantwortlich für den Inhalt (§ 55 Abs. 2 RStV)",
        responsiblePerson: "Carlo Matic",
        backToMap: "Zurück zur Karte",
        disclaimer: "Angaben gemäß § 5 TMG"
    },
    es: {
        title: "Aviso Legal",
        legalForm: "Angelpower UG (responsabilidad limitada)",
        address: "Belvedereallee 5, 52070 Aquisgrán, Alemania",
        register: "Tribunal de Registro: Tribunal de Distrito de Aquisgrán",
        registerNumber: "Número de Registro: HRB 16897",
        contact: "Contacto",
        email: "Correo electrónico: hi@efoilmap.com",
        phone: "Teléfono: +49 241 91880 1",
        representedBy: "Representado por",
        director: "Carlo Matic (Director Gerente)",
        responsible: "Responsable del contenido (§ 55 Abs. 2 RStV)",
        responsiblePerson: "Carlo Matic",
        backToMap: "Volver al Mapa",
        disclaimer: "Información según § 5 TMG"
    },
    fr: {
        title: "Mentions Légales",
        legalForm: "Angelpower UG (responsabilité limitée)",
        address: "Belvedereallee 5, 52070 Aix-la-Chapelle, Allemagne",
        register: "Tribunal d'enregistrement : Tribunal d'instance d'Aix-la-Chapelle",
        registerNumber: "Numéro d'enregistrement : HRB 16897",
        contact: "Contact",
        email: "E-mail : hi@efoilmap.com",
        phone: "Téléphone : +49 241 91880 1",
        representedBy: "Représenté par",
        director: "Carlo Matic (Directeur Général)",
        responsible: "Responsable du contenu (§ 55 Abs. 2 RStV)",
        responsiblePerson: "Carlo Matic",
        backToMap: "Retour à la Carte",
        disclaimer: "Informations conformes à l'article 5 de la TMG"
    },
    it: {
        title: "Note Legali",
        legalForm: "Angelpower UG (responsabilità limitata)",
        address: "Belvedereallee 5, 52070 Aquisgrana, Germania",
        register: "Ufficio del registro: Tribunale di Aquisgrana",
        registerNumber: "Numero di registro: HRB 16897",
        contact: "Contatti",
        email: "Email: hi@efoilmap.com",
        phone: "Telefono: +49 241 91880 1",
        representedBy: "Rappresentato da",
        director: "Carlo Matic (Amministratore Delegato)",
        responsible: "Responsabile del contenuto (§ 55 Abs. 2 RStV)",
        responsiblePerson: "Carlo Matic",
        backToMap: "Torna alla Mappa",
        disclaimer: "Informazioni ai sensi del § 5 TMG"
    },
    pt: {
        title: "Aviso Legal",
        legalForm: "Angelpower UG (responsabilidade limitada)",
        address: "Belvedereallee 5, 52070 Aachen, Alemanha",
        register: "Tribunal de Registo: Tribunal de Comarca de Aachen",
        registerNumber: "Número de Registo: HRB 16897",
        contact: "Contacto",
        email: "E-mail: hi@efoilmap.com",
        phone: "Telefone: +49 241 91880 1",
        representedBy: "Representado por",
        director: "Carlo Matic (Diretor Executivo)",
        responsible: "Responsável pelo conteúdo (§ 55 Abs. 2 RStV)",
        responsiblePerson: "Carlo Matic",
        backToMap: "Voltar ao Mapa",
        disclaimer: "Informações de acordo com o § 5 TMG"
    },
    nl: {
        title: "Colofon",
        legalForm: "Angelpower UG (beperkte aansprakelijkheid)",
        address: "Belvedereallee 5, 52070 Aken, Duitsland",
        register: "Registratiekamer: Kantongerecht Aken",
        registerNumber: "Registratienummer: HRB 16897",
        contact: "Contact",
        email: "E-mail: hi@efoilmap.com",
        phone: "Telefoon: +49 241 91880 1",
        representedBy: "Vertegenwoordigd door",
        director: "Carlo Matic (Algemeen Directeur)",
        responsible: "Verantwoordelijk voor de inhoud (§ 55 lid 2 RStV)",
        responsiblePerson: "Carlo Matic",
        backToMap: "Terug naar Kaart",
        disclaimer: "Informatie volgens § 5 TMG"
    },
    pl: {
        title: "Nota Prawna",
        legalForm: "Angelpower UG (z ograniczoną odpowiedzialnością)",
        address: "Belvedereallee 5, 52070 Akwizgran, Niemcy",
        register: "Sąd rejestrowy: Sąd Rejonowy w Akwizgranie",
        registerNumber: "Numer rejestru: HRB 16897",
        contact: "Kontakt",
        email: "E-mail: hi@efoilmap.com",
        phone: "Telefon: +49 241 91880 1",
        representedBy: "Reprezentowany przez",
        director: "Carlo Matic (Dyrektor Zarządzający)",
        responsible: "Odpowiedzialny za treść (§ 55 ust. 2 RStV)",
        responsiblePerson: "Carlo Matic",
        backToMap: "Powrót do Mapy",
        disclaimer: "Informacje zgodnie z § 5 TMG"
    },
    sv: {
        title: "Om webbplatsen (Impressum)",
        legalForm: "Angelpower UG (med begränsat ansvar)",
        address: "Belvedereallee 5, 52070 Aachen, Tyskland",
        register: "Registreringsdomstol: Tingsrätten i Aachen",
        registerNumber: "Registreringsnummer: HRB 16897",
        contact: "Kontakt",
        email: "E-post: hi@efoilmap.com",
        phone: "Telefon: +49 241 91880 1",
        representedBy: "Representeras av",
        director: "Carlo Matic (Verkställande Direktör)",
        responsible: "Ansvarig för innehåll (§ 55 Abs. 2 RStV)",
        responsiblePerson: "Carlo Matic",
        backToMap: "Tillbaka till Kartan",
        disclaimer: "Information enligt § 5 TMG"
    }
};

export default function Imprint() {
    const { locale } = useLanguage();
    const t = (locale as string) in content ? content[locale as keyof typeof content] : content.en;

    return (
        <div className="h-full overflow-y-auto bg-background text-foreground p-8 relative flex flex-col justify-between">
            <div className="max-w-2xl mx-auto space-y-8 pb-20">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
                    <ArrowLeft className="w-4 h-4" />
                    {t.backToMap}
                </Link>

                <h1 className="text-3xl font-bold">{t.title}</h1>

                <section className="space-y-4">
                    <p className="text-sm text-muted-foreground">{t.disclaimer}</p>

                    <div className="bg-card border border-border p-6 rounded-lg space-y-2">
                        <p className="font-bold">{t.legalForm}</p>
                        <p>{t.address}</p>
                        <p className="text-xs text-muted-foreground mt-4">
                            {t.register}<br />
                            {t.registerNumber}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">{t.contact}</h2>
                        <p>{t.email}</p>
                        <p>{t.phone}</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">{t.representedBy}</h2>
                        <p>{t.director}</p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold">{t.responsible}</h2>
                        <p>{t.responsiblePerson}</p>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
