"use client";

import { useLanguage } from "@/lib/i18n";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";

const content = {
    en: {
        title: "Community Guidelines",
        backToMap: "Back to Map",
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
        backToMap: "Zurück zur Karte",
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
        backToMap: "Volver al Mapa",
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
        backToMap: "Retour à la Carte",
        intro: "Bienvenue sur eFoilMap ! Pour garder cette plateforme sûre et utile pour tous, veuillez suivre ces directives :",
        rules: [
            { title: "Respectez les Lois Locales", text: "N'ajoutez que des spots où l'eFoil est légalement autorisé ou officiellement toléré. N'ajoutez pas de spots dans des réserves naturelles." },
            { title: "Soyez Respectueux", text: "Traitez tous les membres avec respect. Le harcèlement ou les propos haineux ne seront pas tolérés." },
            { title: "Fournissez des Informations Précises", text: "Soyez aussi précis que possible concernant le stationnement, les points d'entrée et les dangers locaux." },
            { title: "Un Avis par Spot", text: "Vous ne pouvez laisser qu'un seul avis par spot. Vous pouvez mettre à jour votre avis à tout moment." },
            { title: "Respectez la Vie Privée", text: "Ne téléchargez pas de photos contenant des visages identifiables d'inconnus sans leur consentement." }
        ],
        outro: "La violation de ces règles peut entraîner la suspension de votre compte. Construisons une belle communauté ensemble !"
    },
    it: {
        title: "Linee Guida della Community",
        backToMap: "Torna alla Mappa",
        intro: "Benvenuto su eFoilMap! Per mantenere questa piattaforma sicura e utile per tutti, ti preghiamo di seguire queste linee guida:",
        rules: [
            { title: "Rispetta le Leggi Locali", text: "Aggiungi solo spot in cui l'eFoiling è legalmente consentito o ufficialmente tollerato. Non aggiungere spot in riserve naturali o zone vietate." },
            { title: "Sii Rispettoso", text: "Tratta tutti i membri della community con rispetto. Non saranno tollerate molestie, incitamento all'odio o linguaggio inappropriato nelle recensioni o nelle biografie." },
            { title: "Fornisci Informazioni Accurate", text: "Quando aggiungi uno spot o una recensione, sii il più preciso possibile riguardo a parcheggio, punti di ingresso e pericoli locali." },
            { title: "Una Sola Recensione per Spot", text: "Puoi lasciare solo una recensione per spot per mantenere le valutazioni eque. Puoi aggiornare la tua recensione in qualsiasi momento." },
            { title: "Rispetta la Privacy", text: "Non caricare foto contenenti volti identificabili di estranei senza il loro consenso." }
        ],
        outro: "La violazione di queste regole può comportare la sospensione del tuo account e la rimozione dei tuoi contributi. Costruiamo insieme una grande community!"
    },
    pt: {
        title: "Diretrizes da Comunidade",
        backToMap: "Voltar ao Mapa",
        intro: "Bem-vindo ao eFoilMap! Para manter esta plataforma segura e útil para todos, por favor siga estas diretrizes:",
        rules: [
            { title: "Respeite as Leis Locais", text: "Adicione apenas spots onde o eFoiling é legalmente permitido ou oficialmente tolerado. Não adicione spots em reservas naturais ou zonas proibidas." },
            { title: "Seja Respeitoso", text: "Trate todos os membros da comunidade com respeito. Assédio, discurso de ódio ou linguagem inadequada nas avaliações ou bios não serão tolerados." },
            { title: "Forneça Informações Precisas", text: "Ao adicionar um spot ou avaliação, seja o mais preciso possível em relação ao estacionamento, pontos de entrada e perigos locais." },
            { title: "Uma Avaliação por Spot", text: "Apenas pode deixar uma avaliação por spot para manter as classificações justas. Pode atualizar a sua avaliação a qualquer momento." },
            { title: "Respeite a Privacidade", text: "Não carregue fotos que contenham rostos identificáveis de estranhos sem o consentimento deles." }
        ],
        outro: "A violação destas regras pode resultar na suspensão da sua conta e na remoção das suas contribuições. Vamos construir uma grande comunidade juntos!"
    },
    nl: {
        title: "Communityrichtlijnen",
        backToMap: "Terug naar Kaart",
        intro: "Welkom bij eFoilMap! Om dit platform veilig en nuttig te houden voor iedereen, verzoeken we je deze richtlijnen te volgen:",
        rules: [
            { title: "Respecteer lokale wetten", text: "Voeg alleen spots toe waar eFoiling wettelijk is toegestaan of officieel wordt gedoogd. Voeg geen spots toe in natuurgebieden of verboden zones." },
            { title: "Wees respectvol", text: "Behandel alle communityleden met respect. Intimidatie, haatzaaiende uitlatingen of ongepast taalgebruik in beoordelingen of biografieën worden niet getolereerd." },
            { title: "Geef nauwkeurige informatie", text: "Wees bij het toevoegen van een spot of beoordeling zo nauwkeurig mogelijk over parkeren, toegangspunten en lokale gevaren." },
            { title: "Eén beoordeling per spot", text: "Je kunt slechts één beoordeling per spot achterlaten om de beoordelingen eerlijk te houden. Je kunt je beoordeling op elk moment bijwerken." },
            { title: "Respecteer privacy", text: "Upload geen foto's met herkenbare gezichten van vreemden zonder hun toestemming." }
        ],
        outro: "Het schenden van deze regels kan leiden tot opschorting van je account en verwijdering van je bijdragen. Laten we samen een geweldige community opbouwen!"
    },
    pl: {
        title: "Wytyczne dla Społeczności",
        backToMap: "Powrót do Mapy",
        intro: "Witaj w eFoilMap! Aby ta platforma była bezpieczna i użyteczna dla wszystkich, prosimy o przestrzeganie następujących wytycznych:",
        rules: [
            { title: "Przestrzegaj Lokalnych Przepisów", text: "Dodawaj tylko te spoty, w których eFoiling jest prawnie dozwolony lub oficjalnie tolerowany. Nie dodawaj spotów w rezerwatach przyrody ani strefach zakazanych." },
            { title: "Bądź Pełen Szacunku", text: "Traktuj wszystkich członków społeczności z szacunkiem. Molestowanie, mowa nynawiści lub nieodpowiedni język w opiniach i biogramach nie będą tolerowane." },
            { title: "Podawaj Dokładne Informacje", text: "Dodając spot lub opinię, podaj jak najdokładniejsze informacje dotyczące parkowania, punktów wodowania i lokalnych zagrożeń." },
            { title: "Jedna Opinia na Spot", text: "Możesz zostawić tylko jedną opinię na spot, aby oceny były sprawiedliwe. Możesz zaktualizować swoją opinię w dowolnym momencie." },
            { title: "Szanuj Prywatność", text: "Nie przesyłaj zdjęć zawierających rozpoznawalne twarze obcych osób bez ich zgody." }
        ],
        outro: "Naruszenie tych zasad może skutkować zawieszeniem konta i usunięciem Twojego wkładu. Stwórzmy razem wspaniałą społeczność!"
    },
    sv: {
        title: "Community-riktlinjer",
        backToMap: "Tillbaka till Kartan",
        intro: "Välkommen till eFoilMap! För att hålla denna plattform säker och användbar för alla, vänligen följ dessa riktlinjer:",
        rules: [
            { title: "Respektera Lokala Lagar", text: "Lägg endast till platser där eFoiling är lagligt tillåtet eller officiellt tolererat. Lägg inte till platser i naturreservat eller förbjudna zoner." },
            { title: "Visa Respekt", text: "Behandla alla community-medlemmar med respekt. Trakasserier, hatpropaganda eller olämpligt språk i recensioner eller bios kommer inte att tolereras." },
            { title: "Ge Korrekt Information", text: "När du lägger till en plats eller recension, var så exakt som möjligt angående parkering, iläggsplatser och lokala faror." },
            { title: "En Recension Per Plats", text: "Du kan bara lämna en recension per plats för att hålla betygen rättvisa. Du kan uppdatera din recension när som hest." },
            { title: "Respektera Integriteten", text: "Ladda inte upp bilder som innehåller identifierbara ansikten på främlingar utan deras samtycke." }
        ],
        outro: "Brott mot dessa regler kan leda till att ditt konto stängs av och att dina bidrag tas bort. Låt oss bygga ett fantastiskt community tillsammans!"
    }
};

export default function CommunityRulesPage() {
    const { locale } = useLanguage();
    const currentContent = (content as Record<string, typeof content.en>)[locale] || content.en;

    return (
        <div className="h-full overflow-y-auto bg-background text-foreground flex flex-col items-center justify-between py-12 px-4 sm:px-6 relative">
            <div className="max-w-2xl w-full pb-12 flex-1">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors mb-4 text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    {currentContent.backToMap}
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
            <Footer isStatic />
        </div>
    );
}
