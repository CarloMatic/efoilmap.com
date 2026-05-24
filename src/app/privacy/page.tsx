"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Footer } from "@/components/Footer";

// We define localized content for the Privacy Policy. 
// For maximum legal precision and user experience, we translate the core headers and sections into all 9 languages.
const content = {
    en: {
        title: "Privacy Policy",
        lastUpdated: "Last updated: May 24, 2026",
        backToMap: "Back to Map",
        sections: {
            controller: {
                title: "1. Data Controller",
                desc: "The entity responsible for processing data on this website in accordance with the General Data Protection Regulation (GDPR) is:",
                company: "Angelpower UG (limited liability)",
                address: "Belvedereallee 5, 52070 Aachen, Germany",
                email: "Email: hi@efoilmap.com",
                represented: "Represented by: Carlo Matic"
            },
            collection: {
                title: "2. Collection and Processing of Personal Data",
                desc: "We collect and process personal data only to the extent necessary to provide a functioning community platform. This includes:",
                items: [
                    {
                        bold: "Authentication & Account Data: ",
                        text: "When you register or sign in via our passwordless magic links, we collect and store your email address. If you set up a profile, we store your self-selected username, bio, and custom avatar photo.",
                        basis: "Legal Basis: Art. 6 para. 1 lit. b GDPR (performance of a contract)."
                    },
                    {
                        bold: "User Generated Content (UGC): ",
                        text: "Spot coordinates, descriptions, amenities, and community reviews/ratings you post are saved in our database to compile the interactive community map.",
                        basis: "Legal Basis: Art. 6 para. 1 lit. b GDPR (contractual fulfillment) and Art. 6 para. 1 lit. f GDPR (legitimate interest)."
                    },
                    {
                        bold: "Technical Log Files: ",
                        text: "When accessing the site, your browser automatically transmits connection metadata (such as IP address, date/time, browser type, referrer URL) to our hosting servers for security analysis and spam prevention.",
                        basis: "Legal Basis: Art. 6 para. 1 lit. f GDPR (legitimate interest in security)."
                    }
                ]
            },
            processors: {
                title: "3. Third-Party Processors & Data Transfer",
                desc: "To operate this platform, we rely on trusted infrastructure providers with whom we have signed Data Processing Agreements (DPA) in compliance with Art. 28 GDPR:",
                items: [
                    {
                        bold: "Supabase, Inc. (Database & Auth): ",
                        text: "User credentials, profiles, spot logs, reviews, and uploaded photos are hosted securely on Supabase databases and storage buckets (hosted on EU-compliant infrastructure). Supabase manages our PKCE passwordless secure login."
                    },
                    {
                        bold: "Mapbox, Inc. (Interactive Map): ",
                        text: "We use Mapbox to render geographical tiles. To prevent tracking, Mapbox is fully blocked by default until you explicitly give cookie consent. If you accept functional cookies, your IP address is sent to Mapbox to fetch maps.",
                        basis: "Legal Basis: Art. 6 para. 1 lit. a GDPR (explicit consent via the cookie banner)."
                    },
                    {
                        bold: "Google Translate API (Translations): ",
                        text: "We integrate Google Translate client-side to dynamically translate reviews and descriptions. This service is loaded lazily only when a user triggers translations of user-generated content."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies and Local Storage",
                desc: "We use local storage strictly to save your operational preferences. This includes:",
                items: [
                    "efoilmap-consent: Stores your cookie banner choice (true/false).",
                    "efoilmap-lang: Remembers your selected language route.",
                    "efoilmap-intro-dismissed: Remembers if you have read the onboarding message."
                ],
                outro: "No third-party tracking pixels or behavioral advertising scripts are active on this website."
            },
            deletion: {
                title: "5. Account Deletion and Data Retention",
                desc: "Your personal account data is kept as long as your profile exists. If you decide to delete your profile, we immediately trigger a cascading database command:",
                items: [
                    "All profile fields, avatar photos, and reviews are permanently destroyed.",
                    "Spot listings you contributed are anonymized (authorship is set to null). This ensures that coordinate entries remain plotted to safeguard community integrity, while all links to your personal identity are completely severed."
                ]
            },
            rights: {
                title: "6. Your Rights as a Data Subject",
                desc: "Under the GDPR, you have the following rights regarding your personal data:",
                items: [
                    "Art. 15 GDPR (Right of Access): Right to obtain confirmation and a copy of your stored data.",
                    "Art. 16 GDPR (Right to Rectification): Right to correct inaccurate data.",
                    "Art. 17 GDPR (Right to Erasure): Right to have your account and personal history deleted.",
                    "Art. 18 & 21 GDPR (Restriction & Objection): Right to restrict or object to processing.",
                    "Art. 20 GDPR (Data Portability): Right to export your personal data in a structured format.",
                    "Art. 77 GDPR (Complaint): Right to lodge a complaint with a competent data protection supervisory authority."
                ],
                outro: "To exercise any of these rights, please email us directly at hi@efoilmap.com."
            }
        }
    },
    de: {
        title: "Datenschutzerklärung",
        lastUpdated: "Zuletzt aktualisiert: 24. Mai 2026",
        backToMap: "Zurück zur Karte",
        sections: {
            controller: {
                title: "1. Verantwortlicher",
                desc: "Die für die Datenverarbeitung auf dieser Website verantwortliche Stelle im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:",
                company: "Angelpower UG (haftungsbeschränkt)",
                address: "Belvedereallee 5, 52070 Aachen, Deutschland",
                email: "E-Mail: hi@efoilmap.com",
                represented: "Vertreten durch: Carlo Matic"
            },
            collection: {
                title: "2. Erhebung und Verarbeitung personenbezogener Daten",
                desc: "Wir erheben und verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Community-Plattform erforderlich ist. Dies umfasst:",
                items: [
                    {
                        bold: "Authentifizierung & Kontodaten: ",
                        text: "Wenn Sie sich über unsere passwortlosen Magic-Links registrieren oder anmelden, erheben und speichern wir Ihre E-Mail-Adresse. Wenn Sie ein Profil einrichten, speichern wir Ihren selbst gewählten Benutzernamen, Ihre Biografie und Ihr Profilbild.",
                        basis: "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)."
                    },
                    {
                        bold: "Nutzergenerierte Inhalte (UGC): ",
                        text: "Die von Ihnen geposteten Spot-Koordinaten, Beschreibungen, Ausstattungsmerkmale und Bewertungen werden in unserer Datenbank gespeichert, um die interaktive Community-Karte zu erstellen.",
                        basis: "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vertragliche Erfüllung) und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)."
                    },
                    {
                        bold: "Technische Logdateien: ",
                        text: "Beim Zugriff auf die Website übermittelt Ihr Browser automatisch Verbindungsmetadaten (wie IP-Adresse, Datum/Uhrzeit, Browsertyp, Referrer-URL) an unsere Server zur Sicherheitsanalyse und Spam-Prävention.",
                        basis: "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Systemsicherheit)."
                    }
                ]
            },
            processors: {
                title: "3. Drittanbieter & Datenübertragung",
                desc: "Für den Betrieb dieser Plattform nutzen wir vertrauenswürdige Infrastrukturanbieter, mit denen wir Verträge zur Auftragsverarbeitung (AVV) gemäß Art. 28 DSGVO abgeschlossen haben:",
                items: [
                    {
                        bold: "Supabase, Inc. (Datenbank & Auth): ",
                        text: "Benutzerdaten, Profile, Spots und hochgeladene Fotos werden sicher in den Datenbanken und Storage-Buckets von Supabase gehostet (auf EU-konformer Infrastruktur). Supabase verwaltet unser sicheres, passwortloses Login."
                    },
                    {
                        bold: "Mapbox, Inc. (Interaktive Karte): ",
                        text: "Wir nutzen Mapbox zur Darstellung geografischer Karten. Um Tracking zu verhindern, ist Mapbox standardmäßig vollständig blockiert, bis Sie Ihre Einwilligung erteilen. Bei Einwilligung wird Ihre IP-Adresse an Mapbox übertragen.",
                        basis: "Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (ausdrückliche Einwilligung über den Cookie-Banner)."
                    },
                    {
                        bold: "Google Translate API (Übersetzungen): ",
                        text: "Wir binden Google Translate clientseitig ein, um Bewertungen und Beschreibungen dynamisch zu übersetzen. Dieser Dienst wird nur geladen, wenn ein Nutzer eine Übersetzung anfordert."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies und lokaler Speicher (Local Storage)",
                desc: "Wir nutzen Local Storage ausschließlich zur Speicherung Ihrer Präferenzen. Dies umfasst:",
                items: [
                    "efoilmap-consent: Speichert Ihre Cookie-Entscheidung (true/false).",
                    "efoilmap-lang: Merkt sich Ihre ausgewählte Sprache.",
                    "efoilmap-intro-dismissed: Speichert, ob Sie die Onboarding-Nachricht gelesen haben."
                ],
                outro: "Auf dieser Website sind keine Tracking-Pixel von Drittanbietern oder verhaltensbasierte Werbeskripte aktiv."
            },
            deletion: {
                title: "5. Löschung von Konten und Datenspeicherung",
                desc: "Ihre persönlichen Kontodaten werden so lange aufbewahrt, wie Ihr Profil existiert. Wenn Sie sich entscheiden, Ihr Profil zu löschen, führen wir sofort einen kaskadierenden Löschbefehl aus:",
                items: [
                    "Alle Profilfelder, Avatar-Fotos und Bewertungen werden dauerhaft vernichtet.",
                    "Von Ihnen erstellte Spot-Einträge werden anonymisiert (Autorenschaft wird auf null gesetzt). Dies stellt sicher, dass Koordinateneinträge erhalten bleiben, um die Integrität der Karte zu schützen, während alle Verbindungen zu Ihrer Identität getrennt werden."
                ]
            },
            rights: {
                title: "6. Ihre Rechte als betroffene Person",
                desc: "Nach der DSGVO haben Sie folgende Rechte bezüglich Ihrer personenbezogenen Daten:",
                items: [
                    "Art. 15 DSGVO (Auskunftsrecht): Recht auf Bestätigung und eine Kopie Ihrer gespeicherten Daten.",
                    "Art. 16 DSGVO (Recht auf Berichtigung): Recht auf Berichtigung unrichtiger Daten.",
                    "Art. 17 DSGVO (Recht auf Löschung): Recht auf dauerhafte Löschung Ihres Kontos.",
                    "Art. 18 & 21 DSGVO (Einschränkung & Widerspruch): Recht auf Einschränkung der Verarbeitung oder Widerspruch.",
                    "Art. 20 DSGVO (Recht auf Datenübertragbarkeit): Recht auf Export Ihrer Daten in einem strukturierten Format.",
                    "Art. 77 DSGVO (Beschwerderecht): Recht auf Beschwerde bei einer zuständigen Datenschutzbehörde."
                ],
                outro: "Um eines dieser Rechte auszuüben, schreiben Sie uns direkt an hi@efoilmap.com."
            }
        }
    },
    es: {
        title: "Política de Privacidad",
        lastUpdated: "Última actualización: 24 de mayo de 2026",
        backToMap: "Volver al Mapa",
        sections: {
            controller: {
                title: "1. Responsable del Tratamiento de Datos",
                desc: "La entidad responsable del tratamiento de datos en este sitio web de acuerdo con el Reglamento General de Protección de Datos (RGPD) es:",
                company: "Angelpower UG (responsabilidad limitada)",
                address: "Belvedereallee 5, 52070 Aquisgrán, Alemania",
                email: "Email: hi@efoilmap.com",
                represented: "Representado por: Carlo Matic"
            },
            collection: {
                title: "2. Recogida y Tratamiento de Datos Personales",
                desc: "Recogemos y tratamos datos personales únicamente en la medida necesaria para proporcionar una plataforma comunitaria en funcionamiento. Esto incluye:",
                items: [
                    {
                        bold: "Datos de cuenta y autenticación: ",
                        text: "Cuando te registras o inicias sesión a través de nuestros enlaces mágicos sin contraseña, recopilamos tu dirección de correo electrónico. Si configuras un perfil, guardamos tu nombre de usuario, biografía y foto de perfil.",
                        basis: "Base legal: Art. 6, párr. 1, letra b del RGPD (ejecución de un contrato)."
                    },
                    {
                        bold: "Contenido generado por el usuario (UGC): ",
                        text: "Las coordenadas de los spots, descripciones y reseñas que publicas se guardan en nuestra base de datos para compilar el mapa interactivo de la comunidad.",
                        basis: "Base legal: Art. 6, párr. 1, letra b del RGPD (cumplimiento de contrato) y letra f (interés legítimo)."
                    },
                    {
                        bold: "Archivos de registro técnico: ",
                        text: "Al acceder al sitio, tu navegador transmite automáticamente metadatos de conexión a nuestros servidores con fines de seguridad y prevención de spam.",
                        basis: "Base legal: Art. 6, párr. 1, letra f del RGPD (interés legítimo en la seguridad)."
                    }
                ]
            },
            processors: {
                title: "3. Proveedores de Servicios Externos y Transferencia de Datos",
                desc: "Para operar esta plataforma, contamos con proveedores de infraestructura de confianza con los que hemos firmado acuerdos de encargo de tratamiento (DPA) según el Art. 28 del RGPD:",
                items: [
                    {
                        bold: "Supabase, Inc. (Base de datos y autenticación): ",
                        text: "Los datos de usuario, perfiles y fotos se alojan de forma segura en las bases de datos de Supabase (infraestructura compatible con la UE)."
                    },
                    {
                        bold: "Mapbox, Inc. (Mapa interactivo): ",
                        text: "Usamos Mapbox para mostrar mapas. Mapbox está bloqueado por defecto hasta que das tu consentimiento. Al aceptar las cookies, tu dirección IP se envía a Mapbox para cargar mapas.",
                        basis: "Base legal: Art. 6, párr. 1, letra a del RGPD (consentimiento explícito)."
                    },
                    {
                        bold: "Google Translate API (Traducciones): ",
                        text: "Traducimos reseñas client-side de forma dinámica. Solo se activa bajo demanda del usuario."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies y Almacenamiento Local",
                desc: "Utilizamos el almacenamiento local estrictamente para guardar tus preferencias operativas:",
                items: [
                    "efoilmap-consent: Guarda tu elección del banner de cookies.",
                    "efoilmap-lang: Recuerda tu idioma seleccionado.",
                    "efoilmap-intro-dismissed: Recuerda si has leído el mensaje de bienvenida."
                ],
                outro: "No hay scripts publicitarios o de seguimiento de terceros activos en este sitio."
            },
            deletion: {
                title: "5. Eliminación de Cuentas y Retención de Datos",
                desc: "Tus datos personales se conservan mientras exista tu perfil. Si decides eliminar tu cuenta:",
                items: [
                    "Todos los datos de perfil, fotos de avatar y reseñas se destruyen permanentemente.",
                    "Las contribuciones de spots se vuelven anónimas para proteger la integridad del mapa, eliminando cualquier enlace con tu identidad personal."
                ]
            },
            rights: {
                title: "6. Tus Derechos como Interesado",
                desc: "De acuerdo con el RGPD, tienes los siguientes derechos:",
                items: [
                    "Art. 15 RGPD (Derecho de acceso): Derecho a obtener confirmación y copia de tus datos.",
                    "Art. 16 RGPD (Derecho de rectificación): Derecho a corregir datos incorrectos.",
                    "Art. 17 RGPD (Derecho de supresión): Derecho a borrar tu cuenta y datos personales.",
                    "Art. 18 y 21 RGPD (Limitación y Oposición): Derecho a limitar u oponerse al tratamiento.",
                    "Art. 20 RGPD (Portabilidad de datos): Derecho a exportar tus datos en un formato estructurado.",
                    "Art. 77 RGPD (Derecho a presentar una reclamación): Derecho a reclamar ante una autoridad de control."
                ],
                outro: "Para ejercer cualquiera de estos derechos, contáctanos en hi@efoilmap.com."
            }
        }
    },
    fr: {
        title: "Politique de Confidentialité",
        lastUpdated: "Dernière mise à jour : 24 mai 2026",
        backToMap: "Retour à la Carte",
        sections: {
            controller: {
                title: "1. Responsable du Traitement",
                desc: "L'entité responsable du traitement des données sur ce site conformément au Règlement Général sur la Protection des Données (RGPD) est :",
                company: "Angelpower UG (responsabilité limitée)",
                address: "Belvedereallee 5, 52070 Aix-la-Chapelle, Allemagne",
                email: "Email : hi@efoilmap.com",
                represented: "Représenté par : Carlo Matic"
            },
            collection: {
                title: "2. Collecte et Traitement des Données Personnelles",
                desc: "Nous ne collectons et ne traitons les données personnelles que dans la mesure nécessaire pour assurer le bon fonctionnement de la plateforme. Cela comprend :",
                items: [
                    {
                        bold: "Données de compte et d'authentification : ",
                        text: "Lorsque vous vous inscrivez ou vous connectez via nos liens magiques sans mot de passe, nous collectons votre adresse e-mail. Si vous configurez un profil, nous stockons votre nom d'utilisateur, votre biographie et votre photo de profil.",
                        basis: "Base légale : Art. 6 par. 1 lit. b du RGPD (exécution d'un contrat)."
                    },
                    {
                        bold: "Contenu généré par l'utilisateur (UGC) : ",
                        text: "Les coordonnées des spots, descriptions et avis que vous publiez sont enregistrés dans notre base de données afin de compiler la carte communautaire interactive.",
                        basis: "Base légale : Art. 6 par. 1 lit. b du RGPD (exécution contractuelle) et lit. f (intérêt légitime)."
                    },
                    {
                        bold: "Fichiers journaux techniques : ",
                        text: "Lors de l'accès au site, votre navigateur transmet automatiquement des métadonnées de connexion à nos serveurs pour des raisons de sécurité et de prévention du spam.",
                        basis: "Base légale : Art. 6 par. 1 lit. f du RGPD (intérêt légitime pour la sécurité des systèmes)."
                    }
                ]
            },
            processors: {
                title: "3. Sous-traitants tiers et Transfert de Données",
                desc: "Pour faire fonctionner cette plateforme, nous nous appuyons sur des prestataires d'infrastructure de confiance avec lesquels nous avons signé des contrats de sous-traitance (DPA) conformément à l'Art. 28 du RGPD :",
                items: [
                    {
                        bold: "Supabase, Inc. (Base de données & Authentification) : ",
                        text: "Les identifiants, profils et photos des utilisateurs sont hébergés en toute sécurité sur les bases de données Supabase (infrastructure conforme à l'UE)."
                    },
                    {
                        bold: "Mapbox, Inc. (Carte interactive) : ",
                        text: "Nous utilisons Mapbox pour afficher des cartes. Mapbox est bloqué par défaut jusqu'à ce que vous donniez votre consentement. Si vous acceptez, votre adresse IP est envoyée à Mapbox pour charger les cartes.",
                        basis: "Base légale : Art. 6 par. 1 lit. a du RGPD (consentement explicite)."
                    },
                    {
                        bold: "Google Translate API (Traductions) : ",
                        text: "Nous intégrons Google Translate client-side pour traduire dynamiquement les avis. Ce service n'est activé qu'à la demande de l'utilisateur."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies et Stockage Local",
                desc: "Nous utilisons le stockage local strictement pour enregistrer vos préférences opérationnelles :",
                items: [
                    "efoilmap-consent : Stocke votre choix pour les cookies.",
                    "efoilmap-lang : Se souvient de votre langue sélectionnée.",
                    "efoilmap-intro-dismissed : Se souvient si vous avez lu le message de bienvenue."
                ],
                outro: "Aucun pixel de suivi tiers ou script publicitaire n'est actif sur ce site."
            },
            deletion: {
                title: "5. Suppression de Compte et Rétention des Données",
                desc: "Vos données personnelles sont conservées tant que votre profil existe. Si vous décidez de supprimer votre profil :",
                items: [
                    "Toutes les données de profil, photos d'avatar et avis sont détruites de manière permanente.",
                    "Les contributions de spots sont anonymisées afin de protéger l'intégrité de la carte, supprimant tout lien avec votre identité personnelle."
                ]
            },
            rights: {
                title: "6. Vos Droits en tant que Personne Concernée",
                desc: "Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :",
                items: [
                    "Art. 15 RGPD (Droit d'accès) : Droit d'obtenir confirmation et copie de vos données.",
                    "Art. 16 RGPD (Droit de rectification) : Droit de corriger des données inexactes.",
                    "Art. 17 RGPD (Droit à l'effacement) : Droit de faire supprimer votre compte et votre historique.",
                    "Art. 18 & 21 RGPD (Limitation & Opposition) : Droit de limiter ou de s'opposer au traitement.",
                    "Art. 20 RGPD (Portabilité des données) : Droit d'exporter vos données dans un format structuré.",
                    "Art. 77 RGPD (Droit de réclamation) : Droit de déposer une plainte auprès d'une autorité de contrôle."
                ],
                outro: "Pour exercer l'un de ces droits, veuillez nous contacter à hi@efoilmap.com."
            }
        }
    },
    it: {
        title: "Informativa sulla Privacy",
        lastUpdated: "Ultimo aggiornamento: 24 maggio 2026",
        backToMap: "Torna alla Mappa",
        sections: {
            controller: {
                title: "1. Titolare del Trattamento",
                desc: "Il titolare del trattamento dei dati su questo sito web in conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR) è:",
                company: "Angelpower UG (responsabilità limitata)",
                address: "Belvedereallee 5, 52070 Aquisgrana, Germania",
                email: "Email: hi@efoilmap.com",
                represented: "Rappresentato da: Carlo Matic"
            },
            collection: {
                title: "2. Raccolta e Trattamento dei Dati Personali",
                desc: "Raccogliamo e trattiamo i dati personali solo nella misura necessaria per fornire una piattaforma comunitaria funzionante. Ciò include:",
                items: [
                    {
                        bold: "Dati di autenticazione e account: ",
                        text: "Quando ti registri o accedi tramite i nostri link magici senza password, raccogliamo il tuo indirizzo email. Se configuri un profilo, memorizziamo il nome utente scelto, la biografia e la foto del profilo.",
                        basis: "Base giuridica: Art. 6 par. 1 lett. b GDPR (esecuzione di un contratto)."
                    },
                    {
                        bold: "Contenuto generato dall'utente (UGC): ",
                        text: "Le coordinate degli spot, le descrizioni e le recensioni che pubblichi vengono salvate nel nostro database per compilare la mappa interattiva.",
                        basis: "Base giuridica: Art. 6 par. 1 lett. b GDPR (adempimento contrattuale) e lett. f (legittimo interesse)."
                    },
                    {
                        bold: "File di registro tecnici: ",
                        text: "Durante l'accesso al sito, il tuo browser trasmette automaticamente i metadati di connessione ai nostri server per analisi di sicurezza e prevenzione dello spam.",
                        basis: "Base giuridica: Art. 6 par. 1 lett. f GDPR (legittimo interesse per la sicurezza dei sistemi)."
                    }
                ]
            },
            processors: {
                title: "3. Responsabili Esterni e Trasferimento dei Dati",
                desc: "Per far funzionare questa piattaforma, ci affidiamo a fornitori di infrastrutture di fiducia con i quali abbiamo firmato contratti di trattamento dati (DPA) in conformità con l'Art. 28 GDPR:",
                items: [
                    {
                        bold: "Supabase, Inc. (Database & Auth): ",
                        text: "Le credenziali, i profili e le foto degli utenti sono ospitati in modo sicuro sui database Supabase (infrastruttura conforme all'UE)."
                    },
                    {
                        bold: "Mapbox, Inc. (Mappa interattiva): ",
                        text: "Usiamo Mapbox per mostrare le mappe. Mapbox è bloccato per impostazione predefinita finché non viene fornito il consenso. In caso di consenso, l'indirizzo IP viene inviato a Mapbox per caricare le mappe.",
                        basis: "Base giuridica: Art. 6 par. 1 lett. a GDPR (consenso esplicito)."
                    },
                    {
                        bold: "Google Translate API (Traduzioni): ",
                        text: "Integriamo Google Translate client-side per tradurre le recensioni. Si attiva solo su richiesta dell'utente."
                    }
                ]
            },
            cookies: {
                title: "4. Cookie e Memoria Locale",
                desc: "Utilizziamo la memoria locale esclusivamente per salvare le tue preferenze operative:",
                items: [
                    "efoilmap-consent: Memorizza la scelta del banner dei cookie.",
                    "efoilmap-lang: Ricorda la lingua selezionata.",
                    "efoilmap-intro-dismissed: Ricorda se hai letto il messaggio di benvenuto."
                ],
                outro: "Su questo sito non sono attivi cookie di tracciamento di terze parti o script pubblicitari."
            },
            deletion: {
                title: "5. Cancellazione dell'Account e Conservazione dei Dati",
                desc: "I tuoi dati personali vengono conservati finché esiste il tuo profilo. Se decidi di cancellare il tuo profilo:",
                items: [
                    "Tutti i dati del profilo, le foto e le recensioni vengono distrutti in modo permanente.",
                    "I contributi degli spot vengono resi anonimi per proteggere l'integrität della mappa, eliminando qualsiasi collegamento con la tua identità."
                ]
            },
            rights: {
                title: "6. I Tuoi Diritti in quanto Interessato",
                desc: "Ai sensi del GDPR, disponi dei seguenti diritti:",
                items: [
                    "Art. 15 GDPR (Diritto di accesso): Diritto di ottenere conferma e copia dei propri dati.",
                    "Art. 16 GDPR (Diritto di rettifica): Diritto di correggere dati inesatti.",
                    "Art. 17 GDPR (Diritto alla cancellazione): Diritto di far cancellare il proprio account e i dati personali.",
                    "Art. 18 & 21 GDPR (Limitazione e Opposizione): Diritto di limitare o opporsi al trattamento.",
                    "Art. 20 GDPR (Portabilità dei dati): Diritto di esportare i propri dati in un formato strutturato.",
                    "Art. 77 GDPR (Diritto di reclamo): Diritto di proporre reclamo a un'autorità di controllo."
                ],
                outro: "Per esercitare uno di questi diritti, scrivici direttamente a hi@efoilmap.com."
            }
        }
    },
    pt: {
        title: "Política de Privacidade",
        lastUpdated: "Última atualização: 24 de maio de 2026",
        backToMap: "Volver al Mapa",
        sections: {
            controller: {
                title: "1. Responsável pelo Tratamento de Dados",
                desc: "A entidade responsável pelo tratamento de dados neste site em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD) é:",
                company: "Angelpower UG (responsabilidade limitada)",
                address: "Belvedereallee 5, 52070 Aachen, Alemanha",
                email: "Email: hi@efoilmap.com",
                represented: "Representado por: Carlo Matic"
            },
            collection: {
                title: "2. Recolha e Tratamento de Dados Pessoais",
                desc: "Recolhemos e tratamos dados pessoais apenas na medida necessária para fornecer uma plataforma comunitária em funcionamento. Isto inclui:",
                items: [
                    {
                        bold: "Dados de conta e autenticação: ",
                        text: "Quando se regista ou inicia sessão através dos nossos links mágicos sem palavra-passe, recolhemos o seu endereço de e-mail. Se configurar um perfil, guardamos o seu nome de utilizador, biografia e foto de perfil.",
                        basis: "Base legal: Art. 6º, par. 1, alínea b do RGPD (execução de um contrato)."
                    },
                    {
                        bold: "Conteúdo gerado pelo utilizador (UGC): ",
                        text: "As coordenadas dos spots, descrições e avaliações que publica são guardadas na nossa base de dados para compilar o mapa comunitário interativo.",
                        basis: "Base legal: Art. 6º, par. 1, alínea b do RGPD (cumprimento de contrato) e alínea f (interesse legítimo)."
                    },
                    {
                        bold: "Ficheiros de registo técnico: ",
                        text: "Ao aceder ao site, o seu navegador transmite automaticamente metadados de ligação aos nossos servidores com fins de segurança e prevenção de spam.",
                        basis: "Base legal: Art. 6º, par. 1, alínea f do RGPD (interesse legítimo na segurança dos sistemas)."
                    }
                ]
            },
            processors: {
                title: "3. Prestadores de Serviços Externos e Transferência de Dados",
                desc: "Para operar esta plataforma, contamos com prestadores de infraestrutura de confiança com os quais assinámos contratos de subcontratação (DPA) nos termos do Art. 28º do RGPD:",
                items: [
                    {
                        bold: "Supabase, Inc. (Base de dados e autenticação): ",
                        text: "Os dados de utilizador, perfis e fotos são alojados de forma segura nas bases de dados da Supabase (infraestrutura em conformidade com a UE)."
                    },
                    {
                        bold: "Mapbox, Inc. (Mapa interativo): ",
                        text: "Utilizamos o Mapbox para mostrar mapas. O Mapbox está bloqueado por defeito até que dê o seu consentimento. Ao aceitar, o seu endereço IP é enviado ao Mapbox para carregar os mapas.",
                        basis: "Base legal: Art. 6º, par. 1, alínea a do RGPD (consentimento explícito)."
                    },
                    {
                        bold: "Google Translate API (Traduções): ",
                        text: "Integramos o Google Translate client-side para traduzir avaliações de forma dinâmica. Apenas se ativa a pedido do utilizador."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies e Armazenamento Local",
                desc: "Utilizamos o armazenamento local estritamente para guardar as suas preferências operacionais:",
                items: [
                    "efoilmap-consent: Guarda a sua escolha no banner de cookies.",
                    "efoilmap-lang: Lembra o seu idioma selecionado.",
                    "efoilmap-intro-dismissed: Lembra se leu a mensagem de boas-vindas."
                ],
                outro: "Não há scripts de publicidade ou monitorização de terceiros ativos neste site."
            },
            deletion: {
                title: "5. Eliminação de Contas e Retenção de Dados",
                desc: "Os seus dados pessoais são conservados enquanto o seu perfil existir. Se decidir eliminar a sua conta:",
                items: [
                    "Todos os dados do perfil, fotos e avaliações são permanentemente destruídos.",
                    "As contribuições dos spots são anonimizadas para proteger a integridade do mapa, eliminando qualquer ligação à sua identidade pessoal."
                ]
            },
            rights: {
                title: "6. Os Seus Direitos como Titular dos Dados",
                desc: "Nos termos do RGPD, dispõe dos seguintes direitos:",
                items: [
                    "Art. 15º RGPD (Direito de acesso): Direito a obter confirmação e cópia dos seus dados.",
                    "Art. 16º RGPD (Direito de retificação): Direito a corrigir dados incorretos.",
                    "Art. 17º RGPD (Direito ao apagamento): Direito a apagar a sua conta e dados pessoais.",
                    "Art. 18º & 21º RGPD (Limitação e Oposição): Direito a limitar ou opor-se ao tratamento.",
                    "Art. 20º RGPD (Portabilidade dos dados): Direito a exportar os seus dados num formato estruturado.",
                    "Art. 77º RGPD (Direito de reclamação): Direito a apresentar queixa junto de uma autoridade de controlo."
                ],
                outro: "Para exercer qualquer um destes direitos, contacte-nos através de hi@efoilmap.com."
            }
        }
    },
    nl: {
        title: "Privacybeleid",
        lastUpdated: "Laatst bijgewerkt: 24 mei 2026",
        backToMap: "Terug naar Kaart",
        sections: {
            controller: {
                title: "1. Verwerkingsverantwoordelijke",
                desc: "De entiteit die verantwoordelijk is voor de verwerking van gegevens op deze website in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG) is:",
                company: "Angelpower UG (beperkte aansprakelijkheid)",
                address: "Belvedereallee 5, 52070 Aken, Duitsland",
                email: "E-mail: hi@efoilmap.com",
                represented: "Vertegenwoordigd door: Carlo Matic"
            },
            collection: {
                title: "2. Verzameling en Verwerking van Persoonsgegevens",
                desc: "Wij verzamelen en verwerken persoonsgegevens alleen voor zover dat nodig is om een werkend community-platform te bieden. Dit omvat:",
                items: [
                    {
                        bold: "Authenticatie- & accountgegevens: ",
                        text: "Wanneer je je registreert of inlogt via onze wachtwoordloze magic links, verzamelen en bewaren we je e-mailadres. Als je een profiel aanmaakt, bewaren we je gebruikersnaam, bio en profielfoto.",
                        basis: "Wettelijke grondslag: Art. 6 lid 1 sub b AVG (uitvoering van een overeenkomst)."
                    },
                    {
                        bold: "User Generated Content (UGC): ",
                        text: "Mede door jou geposte spotcoördinaten, beschrijvingen en beoordelingen worden opgeslagen in onze database om de interactieve communitykaart samen te stellen.",
                        basis: "Wettelijke grondslag: Art. 6 lid 1 sub b AVG (contractuele nakoming) en sub f (gerechtvaardigd belang)."
                    },
                    {
                        bold: "Technische logbestanden: ",
                        text: "Bij het bezoeken van de site verzendt je browser automatisch verbindingsmetadata naar onze servers voor veiligheidsanalyse en spampreventie.",
                        basis: "Wettelijke grondslag: Art. 6 lid 1 sub f AVG (gerechtvaardigd belang bij systeembeveiliging)."
                    }
                ]
            },
            processors: {
                title: "3. Externe Verwerkers & Gegevensoverdracht",
                desc: "Om dit platform te exploiteren, vertrouwen we op vertrouwde infrastructuurproviders waarmee we verwerkersovereenkomsten (DPA) hebben gesloten in overeenstemming met Art. 28 AVG:",
                items: [
                    {
                        bold: "Supabase, Inc. (Database & Auth): ",
                        text: "Gebruikersgegevens, profielen en foto's worden veilig gehost op Supabase-databases (gehost op EU-conforme infrastructuur)."
                    },
                    {
                        bold: "Mapbox, Inc. (Interactieve kaart): ",
                        text: "We gebruiken Mapbox om kaarten weer te geven. Mapbox is standaard geblokkeerd tot je toestemming geeft. Bij toestemming wordt je IP-adres naar Mapbox verzonden om kaarten te laden.",
                        basis: "Wettelijke grondslag: Art. 6 lid 1 sub a AVG (expliciete toestemming via de cookiebanner)."
                    },
                    {
                        bold: "Google Translate API (Vertalingen): ",
                        text: "We integreren Google Translate client-side om beoordelingen dynamisch te vertalen. Dit wordt alleen geactiveerd op verzoek van de gebruiker."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies en Lokale Opslag",
                desc: "We gebruiken lokale opslag uitsluitend om je operationele voorkeuren op te slaan:",
                items: [
                    "efoilmap-consent: Slaat je keuze voor de cookiebanner op.",
                    "efoilmap-lang: Onthoudt je geselecteerde taal.",
                    "efoilmap-intro-dismissed: Onthoudt of je het welkomstbericht hebt gelezen."
                ],
                outro: "Er zijn geen trackingspixels van derden of advertentiescripts actief op deze website."
            },
            deletion: {
                title: "5. Accountverwijdering en Gegevensbewaring",
                desc: "Je persoonlijke accountgegevens worden bewaard zolang je profiel bestaat. Als je besluit je profiel te verwijderen:",
                items: [
                    "Alle profielvelden, profielfoto's en beoordelingen worden definitief vernietigd.",
                    "Spotbijdragen worden geanonimiseerd om de integriteit van de kaart te beschermen, waardoor elke link met je identiteit wordt verbroken."
                ]
            },
            rights: {
                title: "6. Jouw Rechten als Betrokkene",
                desc: "Onder de AVG heb je de volgende rechten:",
                items: [
                    "Art. 15 AVG (Recht op inzage): Recht op bevestiging en een kopie van je gegevens.",
                    "Art. 16 AVG (Recht op rectificatie): Recht om onjuiste gegevens te corrigeren.",
                    "Art. 17 AVG (Recht op gegevenswissing): Recht om je account en geschiedenis te laten verwijderen.",
                    "Art. 18 & 21 AVG (Beperking & Bezwaar): Recht om de verwerking te beperken of daartegen bezwaar te maken.",
                    "Art. 20 AVG (Recht op gegevensoverdraagbaarheid): Recht om je gegevens in een gestructureerd formaat te exporteren.",
                    "Art. 77 AVG (Recht om een klacht in te dienen): Recht om een klacht in te dienen bij een toezichthoudende autoriteit."
                ],
                outro: "Om een van deze rechten uit te oefenen, kun je ons rechtstreeks mailen op hi@efoilmap.com."
            }
        }
    },
    pl: {
        title: "Polityka Prywatności",
        lastUpdated: "Ostatnia aktualizacja: 24 maja 2026",
        backToMap: "Powrót do Mapy",
        sections: {
            controller: {
                title: "1. Administrator Danych Osobowych",
                desc: "Podmiotem odpowiedzialnym za przetwarzanie danych na tej stronie internetowej zgodnie z Ogólnym Rozporządzeniem o Ochronie Danych (RODO) jest:",
                company: "Angelpower UG (z ograniczoną odpowiedzialnością)",
                address: "Belvedereallee 5, 52070 Akwizgran, Niemcy",
                email: "Email: hi@efoilmap.com",
                represented: "Reprezentowany przez: Carlo Matic"
            },
            collection: {
                title: "2. Gromadzenie i Przetwarzanie Danych Osobowych",
                desc: "Gromadzimy i przetwarzamy dane osobowe wyłącznie w zakresie niezbędnym do zapewnienia funkcjonowania platformy społecznościowej. Obejmuje to:",
                items: [
                    {
                        bold: "Dane uwierzytelniające i konto: ",
                        text: "Kiedy rejestrujesz się lub logujesz za pomocą naszych linków bez hasła, gromadzimy Twój adres e-mail. Jeśli skonfigurujesz profil, zapisujemy Twoją nazwę użytkownika, biogram i zdjęcie profilowe.",
                        basis: "Podstawa prawna: Art. 6 ust. 1 lit. b RODO (wykonanie umowy)."
                    },
                    {
                        bold: "Treści generowane przez użytkowników (UGC): ",
                        text: "Współrzędne spotów, opisy i recenzje, które publikujesz, są zapisywane w naszej bazie danych w celu skompilowania interaktywnej mapy.",
                        basis: "Podstawa prawna: Art. 6 ust. 1 lit. b RODO (realizacja umowy) i lit. f (uzasadniony interes)."
                    },
                    {
                        bold: "Techniczne pliki dziennika: ",
                        text: "Podczas dostępu do strony Twoja przeglądarka automatycznie przesyła metadane połączenia do naszych serwerów w celach bezpieczeństwa i zapobiegania spamowi.",
                        basis: "Podstawa prawna: Art. 6 ust. 1 lit. f RODO (uzasadniony interes w zakresie bezpieczeństwa systemów)."
                    }
                ]
            },
            processors: {
                title: "3. Zewnętrzni Dostawcy Usług i Transfer Danych",
                desc: "W celu prowadzenia tej platformy korzystamy z zaufanych dostawców infrastruktury, z którymi podpisaliśmy umowy powierzenia przetwarzania danych (DPA) zgodnie z Art. 28 RODO:",
                items: [
                    {
                        bold: "Supabase, Inc. (Baza danych i autoryzacja): ",
                        text: "Dane użytkowników, profile i zdjęcia są bezpiecznie hostowane w bazach danych Supabase (infrastruktura zgodna z UE)."
                    },
                    {
                        bold: "Mapbox, Inc. (Interaktywna mapa): ",
                        text: "Używamy Mapbox do wyświetlania map. Mapbox jest domyślnie zablokowany, dopóki nie wyrazisz zgody. Po wyrażeniu zgody Twój adres IP jest wysyłany do Mapbox w celu załadowania map.",
                        basis: "Podstawa prawna: Art. 6 ust. 1 lit. a RODO (wyraźna zgoda za pośrednictwem baneru cookies)."
                    },
                    {
                        bold: "Google Translate API (Tłumaczenia): ",
                        text: "Dynamicznie tłumaczymy recenzje client-side. Usługa ta jest aktywowana wyłącznie na żądanie użytkownika."
                    }
                ]
            },
            cookies: {
                title: "4. Pliki Cookies i Pamięć Lokalna",
                desc: "Używamy pamięci lokalnej wyłącznie do zapisywania preferencji operacyjnych:",
                items: [
                    "efoilmap-consent: Zapisuje Twój wybór w banerze cookies.",
                    "efoilmap-lang: Zapamiętuje wybrany język.",
                    "efoilmap-intro-dismissed: Zapamiętuje, czy przeczytałeś wiadomość powitalną."
                ],
                outro: "Na tej stronie nie są aktywne żadne pliki cookie śledzące stron trzecich ani skrypty reklamowe."
            },
            deletion: {
                title: "5. Usuwanie Konta i Przechowywanie Danych",
                desc: "Twoje dane osobowe są przechowywane tak długo, jak długo istnieje Twój profil. Jeśli zdecydujesz się usunąć konto:",
                items: [
                    "Wszystkie dane profilu, zdjęcia i recenzje zostaną trwale zniszczone.",
                    "Wpisy dotyczące spotów zostaną zanonimizowane w celu ochrony integralności mapy, usuwając wszelkie powiązania z Twoją tożsamością."
                ]
            },
            rights: {
                title: "6. Twoje Prawa jako Osoby, Której Dane Dotyczą",
                desc: "Zgodnie z RODO przysługują Ci następujące prawa:",
                items: [
                    "Art. 15 RODO (Prawo dostępu): Prawo do uzyskania potwierdzenia i kopii danych.",
                    "Art. 16 RODO (Prawo do sprostowania): Prawo do poprawiania nieprawidłowych danych.",
                    "Art. 17 RODO (Prawo do usunięcia danych): Prawo do usunięcia konta i historii.",
                    "Art. 18 i 21 RODO (Ograniczenie i sprzeciw): Prawo do ograniczenia lub wniesienia sprzeciwu wobec przetwarzania.",
                    "Art. 20 RODO (Przenoszenie danych): Prawo do eksportu danych w ustrukturyzowanym formacie.",
                    "Art. 77 RODO (Prawo do wniesienia skargi): Prawo do wniesienia skargi do organu nadzorczego."
                ],
                outro: "Aby skorzystać z któregokolwiek z tych praw, napisz do nas na hi@efoilmap.com."
            }
        }
    },
    sv: {
        title: "Integritetspolicy",
        lastUpdated: "Senast uppdaterad: 24 maj 2026",
        backToMap: "Tillbaka till Kartan",
        sections: {
            controller: {
                title: "1. Personuppgiftsansvarig",
                desc: "Den enhet som är ansvarig för behandlingen av uppgifter på denna webbplats i enlighet med dataskyddsförordningen (GDPR) är:",
                company: "Angelpower UG (med begränsat ansvar)",
                address: "Belvedereallee 5, 52070 Aachen, Tyskland",
                email: "E-post: hi@efoilmap.com",
                represented: "Representeras av: Carlo Matic"
            },
            collection: {
                title: "2. Insamling och Behandling av Personuppgifter",
                desc: "Vi samlar in och behandlar personuppgifter endast i den utsträckning det är nödvändigt för att tillhandahålla en fungerande community-plattform. Detta inkluderar:",
                items: [
                    {
                        bold: "Autentisering & kontouppgifter: ",
                        text: "När du registrerar dig eller loggar in via våra lösenordsfria magic-länkar samlar vi in din e-postadress. Om du skapar en profil sparar vi ditt valda användarnamn, biografi och profilbild.",
                        basis: "Rättslig grund: Art. 6 para. 1 lit. b GDPR (fullgörande av ett avtal)."
                    },
                    {
                        bold: "Användargenererat innehåll (UGC): ",
                        text: "Platskoordinater, beskrivningar och recensioner du publicerar sparas i vår databas för att sammanställa den interaktiva community-kartan.",
                        basis: "Rättslig grund: Art. 6 para. 1 lit. b GDPR (kontraktuell uppfyllelse) och lit. f (berättigat intresse)."
                    },
                    {
                        bold: "Tekniska loggfiler: ",
                        text: "När du besöker webbplatsen överför din webbläsare automatiskt anslutningsmetadata till våra servrar för säkerhetsanalys och spambekämpning.",
                        basis: "Rättslig grund: Art. 6 para. 1 lit. f GDPR (berättigat intresse av systemsäkerhet)."
                    }
                ]
            },
            processors: {
                title: "3. Tredjepartstjänster och Dataöverföring",
                desc: "För att driva denna plattform förlitar vi oss på betrodda infrastrukturleverantörer med vilka vi har tecknat personuppgiftsbiträdesavtal (DPA) i enlighet med Art. 28 GDPR:",
                items: [
                    {
                        bold: "Supabase, Inc. (Databas & Auth): ",
                        text: "Användaruppgifter, profiler och bilder lagras säkert på Supabase-databaser (infrastruktur godkänd inom EU)."
                    },
                    {
                        bold: "Mapbox, Inc. (Interaktiv karta): ",
                        text: "Vi använder Mapbox för att visa kartor. Mapbox är blockerad som standard tills du ger ditt samtycke. Vid samtycke skickas din IP-adress till Mapbox för att ladda kartor.",
                        basis: "Rättslig grund: Art. 6 para. 1 lit. a GDPR (uttryckligt samtycke via cookie-banderollen)."
                    },
                    {
                        bold: "Google Translate API (Översättningar): ",
                        text: "Vi integrerar Google Translate client-side för att dynamiskt översätta recensioner. Detta aktiveras endast på begäran av användaren."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies och Lokal Lagring",
                desc: "Vi använder lokal lagring uteslutande för att spara dina driftsinställningar:",
                items: [
                    "efoilmap-consent: Lagrar ditt val i cookie-banderollen.",
                    "efoilmap-lang: Kommer ihåg ditt valda språk.",
                    "efoilmap-intro-dismissed: Kommer ihåg om du har läst välkomstmeddelandet."
                ],
                outro: "Inga spårningspixlar eller annonsskript från tredje part är aktiva på denna webbplats."
            },
            deletion: {
                title: "5. Radering av Konto och Datalagring",
                desc: "Dina personuppgifter lagras så länge din profil finns kvar. Om du väljer att radera din profil:",
                items: [
                    "Alla profilfält, profilbilder och recensioner raderas permanent.",
                    "Spot-bidrag anonymiseras för att skydda kartans integritet, vilket tar bort alla kopplingar till din personliga identitet."
                ]
            },
            rights: {
                title: "6. Dina Rättigheter som Registrerad",
                desc: "Enligt GDPR har du följande rättigheter:",
                items: [
                    "Art. 15 GDPR (Rätt till tillgång): Rätt att få bekräftelse och en kopia av dina uppgifter.",
                    "Art. 16 GDPR (Rätt till rättelse): Rätt att korrigera felaktiga uppgifter.",
                    "Art. 17 GDPR (Rätt till radering): Rätt att få ditt konto och historik raderad.",
                    "Art. 18 & 21 GDPR (Begränsning & Invändning): Rätt att begränsa eller invända mot behandling.",
                    "Art. 20 GDPR (Dataportabilitet): Rätt att exportera dina uppgifter i ett strukturerat format.",
                    "Art. 77 GDPR (Rätt att klaga): Rätt att lämna in ett klagomål till en tillsynsmyndighet."
                ],
                outro: "För att utöva någon av dessa rättigheter, maila oss direkt på hi@efoilmap.com."
            }
        }
    }
};

export default function Privacy() {
    const { locale } = useLanguage();
    const t = (locale as string) in content ? content[locale as keyof typeof content] : content.en;

    return (
        <div className="h-full overflow-y-auto bg-background text-foreground p-8 leading-relaxed relative flex flex-col justify-between">
            <div className="max-w-3xl mx-auto space-y-8 pb-20">
                <Link href="/" className="flex items-center gap-2 text-primary hover:underline font-semibold">
                    <ArrowLeft className="w-4 h-4" />
                    {t.backToMap}
                </Link>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight">{t.title}</h1>
                    <p className="text-xs text-muted-foreground">{t.lastUpdated}</p>
                </div>

                <section className="space-y-8 text-sm">
                    {/* 1. Controller */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.controller.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.controller.desc}
                        </p>
                        <div className="bg-card border border-border p-4 rounded-xl space-y-1 text-muted-foreground">
                            <p className="font-semibold text-foreground">{t.sections.controller.company}</p>
                            <p>{t.sections.controller.address}</p>
                            <p>{t.sections.controller.email}</p>
                            <p>{t.sections.controller.represented}</p>
                        </div>
                    </div>

                    {/* 2. Collection & Processing of Personal Data */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.collection.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.collection.desc}
                        </p>
                        <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                            {t.sections.collection.items.map((item, idx) => (
                                <li key={idx}>
                                    <strong className="text-foreground">{item.bold}</strong>
                                    {item.text}
                                    {item.basis && (
                                        <>
                                            <br />
                                            <span className="text-xs italic">{item.basis}</span>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Third-Party Services */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.processors.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.processors.desc}
                        </p>
                        <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                            {t.sections.processors.items.map((item, idx) => (
                                <li key={idx}>
                                    <strong className="text-foreground">{item.bold}</strong>
                                    {item.text}
                                    {item.basis && (
                                        <>
                                            <br />
                                            <span className="text-xs italic">{item.basis}</span>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Cookies & LocalStorage */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.cookies.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.cookies.desc}
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {t.sections.cookies.items.map((item, idx) => (
                                <li key={idx}>
                                    <code className="text-xs text-foreground bg-muted px-1 py-0.5 rounded">
                                        {item.split(":")[0]}
                                    </code>
                                    :{item.split(":")[1]}
                                </li>
                            ))}
                        </ul>
                        <p className="text-xs text-muted-foreground italic mt-2">
                            {t.sections.cookies.outro}
                        </p>
                    </div>

                    {/* 5. Account Deletion & Data Retention */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.deletion.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.deletion.desc}
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {t.sections.deletion.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* 6. Your Legal Rights */}
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.rights.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.rights.desc}
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {t.sections.rights.items.map((item, idx) => (
                                <li key={idx}>
                                    <strong className="text-foreground">{item.split(":")[0]}</strong>
                                    {item.split(":")[1] ? `:${item.split(":")[1]}` : ""}
                                </li>
                            ))}
                        </ul>
                        <p className="text-muted-foreground mt-2">
                            {t.sections.rights.outro}
                        </p>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
