"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { Footer } from "@/components/Footer";

// We define localized content for the Privacy Policy.
const content = {
    en: {
        title: "Privacy Policy",
        lastUpdated: "As of: May 25, 2026",
        backToMap: "Back to Map",
        intro: "This privacy policy explains what personal data we process on efoilmap.com, for what purposes, on what legal basis, and what rights you have.",
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
                title: "2. Processing of Personal Data (Purposes, Data Categories, Legal Bases)",
                desc: "We process personal data only to the extent necessary to provide the community platform and the interactive map. This includes:",
                items: [
                    {
                        bold: "2.1 User Account and Registration (Magic Link)",
                        text: "Processed data: Email address; profile details if applicable (username, bio); avatar image uploaded by you if applicable. Purposes: Registration/Login, account management, provision of community functions.",
                        basis: "Legal Basis: Art. 6 para. 1 lit. b GDPR (Contract/terms of use relationship)."
                    },
                    {
                        bold: "2.2 User Generated Content (Spots, Reviews, Content)",
                        text: "Processed data: Content submitted by you such as spot coordinates, descriptions, amenities, reviews/ratings, photos if applicable, scheduled visits (including date, time, and optional description), coordination comments, and RSVP/attendance statuses. Purposes: Display and maintenance of the interactive community map, sharing and meetups in the community.",
                        basis: "Legal Bases: Art. 6 para. 1 lit. b GDPR (Provision of platform functions) and Art. 6 para. 1 lit. f GDPR (legitimate interest in the operation, quality, and integrity of community data)."
                    },
                    {
                        bold: "2.3 Technical Logfiles",
                        text: "Processed data: Connection/access data (e.g. IP address, date/time, browser type, referrer URL). Purposes: Ensuring security and stability, error analysis, abuse/spam prevention.",
                        basis: "Legal Basis: Art. 6 para. 1 lit. f GDPR (legitimate interest in secure operation)."
                    }
                ]
            },
            processors: {
                title: "3. Recipients / Data Processors and Third-Country Transfers",
                desc: "We use service providers who process personal data on our behalf (processors). Data processing agreements in accordance with Art. 28 GDPR have been concluded with them:",
                items: [
                    {
                        bold: "3.1 Supabase (Database, Auth, Storage): ",
                        text: "We use Supabase for our database, authentication (including passwordless login via Magic Links/PKCE), and storage (e.g. for uploaded pictures). Account data, profile information, spots, reviews, comments, scheduled visits, RSVP statuses, and other uploads are stored/processed there."
                    },
                    {
                        bold: "3.2 Mapbox (Map Tiles): ",
                        text: "We use Mapbox to display the interactive map. Mapbox is blocked by default and only loaded after your consent; upon consent, your IP address, among other data, is transmitted to Mapbox to fetch map content.",
                        basis: "Legal Basis: Art. 6 para. 1 lit. a GDPR (Consent via cookie banner)."
                    },
                    {
                        bold: "3.3 Google Translate (Translations): ",
                        text: "We integrate Google Translate on the client side to dynamically translate content (e.g. reviews/descriptions). The service is loaded only after user action (trigger)."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies / Local Storage",
                desc: "We exclusively store functional settings in Local Storage:",
                items: [
                    "efoilmap-consent: Stores cookie banner choice",
                    "efoilmap-lang: Stores language selection",
                    "efoilmap-intro-dismissed: Flag indicating whether onboarding has been read"
                ],
                outro: "No third-party tracking pixels or behavior-based advertising scripts are active on this website."
            },
            deletion: {
                title: "5. Data Retention / Deletion",
                desc: "We generally store personal account data as long as your profile exists. If you decide to delete your profile, the following is triggered:",
                items: [
                    "Profile fields, avatar images, reviews, coordination comments, scheduled visits, and participation/RSVP states are permanently and cascadingly deleted.",
                    "Spot entries you created remain intact but are anonymized (authorship is set to 'null') so that the community map remains functional."
                ]
            },
            rights: {
                title: "6. Rights of Data Subjects",
                desc: "Under the GDPR, you have the following rights in particular:",
                items: [
                    "Art. 15 GDPR: Right of access",
                    "Art. 16 GDPR: Right to rectification",
                    "Art. 17 GDPR: Right to erasure",
                    "Art. 18 GDPR: Right to restriction of processing",
                    "Art. 21 GDPR: Right to object",
                    "Art. 20 GDPR: Right to data portability",
                    "Art. 77 GDPR: Right to lodge a complaint with a supervisory authority"
                ],
                outro: "To exercise your rights, please contact us by email (see above)."
            },
            supervisory: {
                title: "7. Right to Lodge a Complaint with a Supervisory Authority",
                desc: "You can lodge a complaint with a data protection supervisory authority. Generally, the supervisory authority of your usual place of residence, workplace, or place of the alleged infringement is competent (Art. 77 GDPR)."
            },
            changes: {
                title: "8. Changes to this Privacy Policy",
                desc: "This privacy policy may be adjusted as the platform develops. The version currently published on the website applies (see date above)."
            }
        }
    },
    de: {
        title: "Datenschutzerklärung (efoilmap.com)",
        lastUpdated: "Stand: 25. Mai 2026",
        backToMap: "Zurück zur Karte",
        intro: "Diese Datenschutzerklärung erläutert, welche personenbezogenen Daten wir auf efoilmap.com verarbeiten, zu welchen Zwecken, auf welcher Rechtsgrundlage und welche Rechte du hast.",
        sections: {
            controller: {
                title: "1. Verantwortlicher",
                desc: "Verantwortlich für die Datenverarbeitung auf dieser Website ist:",
                company: "Angelpower UG (haftungsbeschränkt)",
                address: "Belvedereallee 5, 52070 Aachen, Deutschland",
                email: "E-Mail: hi@efoilmap.com",
                represented: "Vertreten durch: Carlo Matic"
            },
            collection: {
                title: "2. Verarbeitung personenbezogener Daten (Zwecke, Datenkategorien, Rechtsgrundlagen)",
                desc: "Wir verarbeiten personenbezogene Daten nur, soweit dies erforderlich ist, um die Community-Plattform und die interaktive Karte bereitzustellen. Dies umfasst:",
                items: [
                    {
                        bold: "2.1 Nutzerkonto und Anmeldung (Magic Link)",
                        text: "Verarbeitete Daten: E-Mail-Adresse; ggf. Profilangaben (Username, Bio); ggf. von dir hochgeladenes Avatarbild. Zwecke: Registrierung/Anmeldung, Kontoverwaltung, Bereitstellung der Community-Funktionen.",
                        basis: "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertrag/ Nutzungsverhältnis)."
                    },
                    {
                        bold: "2.2 User Generated Content (Spots, Bewertungen, Inhalte)",
                        text: "Verarbeitete Daten: von dir eingestellte Inhalte wie Spot-Koordinaten, Beschreibungen, Ausstattung/“Amenities”, Bewertungen/Ratings, Fotos, geplante Termine/Verabredungen (einschließlich Datum, Uhrzeit und optionaler Beschreibung), Koordinationskommentare sowie Zusagen/Absagen (Teilnahmestatus). Zwecke: Darstellung und Pflege der interaktiven Community-Karte, Austausch und Verabredungen in der Community.",
                        basis: "Rechtsgrundlagen: Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der Plattformfunktionen) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Betrieb, Qualität und Integrität der Community-Daten)."
                    },
                    {
                        bold: "2.3 Technische Logfiles",
                        text: "Verarbeitete Daten: Verbindungs-/Zugriffsdaten (z.B. IP-Adresse, Datum/Uhrzeit, Browsertyp, Referrer-URL). Zwecke: Gewährleistung von Sicherheit und Stabilität, Fehleranalyse, Missbrauchs-/Spamprävention.",
                        basis: "Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Betrieb)."
                    }
                ]
            },
            processors: {
                title: "3. Empfänger / Auftragsverarbeiter und Drittlandtransfers",
                desc: "Wir setzen Dienstleister ein, die in unserem Auftrag personenbezogene Daten verarbeiten (Auftragsverarbeiter). Mit diesen bestehen Auftragsverarbeitungsverträge nach Art. 28 DSGVO:",
                items: [
                    {
                        bold: "3.1 Supabase (Datenbank, Auth, Storage)",
                        text: "Wir nutzen Supabase für Datenbank, Authentifizierung (u.a. Passwortlos-Login via Magic Links/PKCE) und Speicher (z.B. für hochgeladene Bilder). Dort werden u.a. Kontodaten, Profilinformationen, Spots, Reviews, Kommentare, Termine, RSVP-Stati und sonstige Uploads gespeichert/verarbeitet."
                    },
                    {
                        bold: "3.2 Mapbox (Kartenkacheln)",
                        text: "Wir nutzen Mapbox zur Darstellung der interaktiven Karte. Mapbox ist standardmäßig blockiert und wird erst nach deiner Einwilligung geladen; bei Einwilligung wird u.a. deine IP-Adresse an Mapbox übermittelt, um Karteninhalte abzurufen.",
                        basis: "Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über Cookie-Banner)."
                    },
                    {
                        bold: "3.3 Google Translate (Übersetzungen)",
                        text: "Wir binden Google Translate clientseitig ein, um Inhalte (z.B. Reviews/Beschreibungen) dynamisch zu übersetzen. Der Dienst wird erst nach deiner Nutzeraktion (Trigger) nachgeladen."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies / Local Storage",
                desc: "Wir speichern ausschließlich funktionale Einstellungen in Local Storage:",
                items: [
                    "efoilmap-consent: Speicherung der Cookie-Banner-Auswahl",
                    "efoilmap-lang: Speicherung der Sprachauswahl",
                    "efoilmap-intro-dismissed: Merker, ob Onboarding gelesen wurde"
                ],
                outro: "Auf dieser Website sind keine Tracking-Pixel von Drittanbietern oder verhaltensbasierte Werbeskripte aktiv."
            },
            deletion: {
                title: "5. Speicherdauer / Löschung",
                desc: "Wir speichern personenbezogene Kontodaten grundsätzlich, solange dein Profil besteht. Wenn du dein Profil löschst, wird Folgendes ausgelöst:",
                items: [
                    "Profilfelder, Avatarbilder, Reviews, Koordinationskommentare, geplante Termine/Verabredungen sowie Zusagen/Absagen (Teilnahmestatus) werden dauerhaft und kaskadierend gelöscht.",
                    "Von dir erstellte Spot-Einträge bleiben erhalten, werden aber anonymisiert (Autorschaft wird auf „null“ gesetzt), damit die Community-Karte funktionsfähig bleibt."
                ]
            },
            rights: {
                title: "6. Rechte der betroffenen Personen",
                desc: "Du hast nach DSGVO insbesondere folgende Rechte:",
                items: [
                    "Art. 15 DSGVO: Auskunft",
                    "Art. 16 DSGVO: Berichtigung",
                    "Art. 17 DSGVO: Löschung",
                    "Art. 18 DSGVO: Einschränkung der Verarbeitung",
                    "Art. 21 DSGVO: Widerspruch",
                    "Art. 20 DSGVO: Datenübertragbarkeit",
                    "Art. 77 DSGVO: Beschwerde bei einer Aufsichtsbehörde"
                ],
                outro: "Zur Ausübung deiner Rechte kontaktiere uns bitte per E-Mail (siehe oben)."
            },
            supervisory: {
                title: "7. Beschwerderecht bei der Aufsichtsbehörde",
                desc: "Du kannst dich bei einer Datenschutz-Aufsichtsbehörde beschweren. Zuständig ist in der Regel die Aufsichtsbehörde deines Aufenthaltsorts, deines Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes (Art. 77 DSGVO)."
            },
            changes: {
                title: "8. Änderungen dieser Datenschutzerklärung",
                desc: "Diese Datenschutzerklärung kann bei Weiterentwicklung der Plattform angepasst werden. Es gilt die jeweils auf der Website veröffentlichte Version (Stand-Datum siehe oben)."
            }
        }
    },
    es: {
        title: "Política de Privacidad (efoilmap.com)",
        lastUpdated: "Última actualización: 25 de mayo de 2026",
        backToMap: "Volver al Mapa",
        intro: "Esta política de privacidad explica qué datos personales procesamos en efoilmap.com, para qué fines, sobre qué base legal y qué derechos tiene usted.",
        sections: {
            controller: {
                title: "1. Responsable del Tratamiento",
                desc: "El responsable del tratamiento de datos en este sitio web en conformidad con el Reglamento General de Protección de Datos (RGPD) es:",
                company: "Angelpower UG (responsabilidad limitada)",
                address: "Belvedereallee 5, 52070 Aquisgrán, Alemania",
                email: "Correo electrónico: hi@efoilmap.com",
                represented: "Representado por: Carlo Matic"
            },
            collection: {
                title: "2. Tratamiento de Datos Personales (Fines, Categorías de Datos, Bases Legales)",
                desc: "Procesamos datos personales solo en la medida necesaria para proporcionar la plataforma comunitaria y el mapa interactivo. Esto incluye:",
                items: [
                    {
                        bold: "2.1 Cuenta de Usuario y Registro (Magic Link)",
                        text: "Datos procesados: Dirección de correo electrónico; detalles del perfil si corresponde (nombre de usuario, biografía); imagen de avatar subida por usted si corresponde. Fines: Registro/Inicio de sesión, gestión de cuentas, prestación de funciones comunitarias.",
                        basis: "Base legal: Art. 6 párr. 1 letra b del RGPD (Relación de contrato/condiciones de uso)."
                    },
                    {
                        bold: "2.2 Contenido Generado por el Usuario (Spots, Reseñas, Contenido)",
                        text: "Datos procesados: Contenido enviado por usted, como coordenadas de spots, descripciones, características, reseñas/calificaciones, fotos si corresponde, visitas programadas (incluyendo fecha, hora y descripción opcional), comentarios de coordinación y estados de asistencia/RSVP. Fines: Visualización y mantenimiento del mapa comunitario interactivo, intercambio y encuentros en la comunidad.",
                        basis: "Bases legales: Art. 6 párr. 1 letra b del RGPD (Prestación de funciones de la plataforma) y Art. 6 párr. 1 letra f del RGPD (interés legítimo en la operación, calidad e integridad de los datos de la comunidad)."
                    },
                    {
                        bold: "2.3 Archivos de Registro Técnico",
                        text: "Datos procesados: Datos de conexión/acceso (por ejemplo, dirección IP, fecha/hora, tipo de navegador, URL de referencia). Fines: Garantizar la seguridad y estabilidad, análisis de errores, prevención de abusos/spam.",
                        basis: "Base legal: Art. 6 párr. 1 letra f del RGPD (interés legítimo en el funcionamiento seguro)."
                    }
                ]
            },
            processors: {
                title: "3. Destinatarios / Encargados del Tratamiento y Transferencias a Terceros Países",
                desc: "Utilizamos proveedores de servicios que procesan datos personales en nuestro nombre (encargados). Se han firmado acuerdos de encargo de tratamiento con ellos según el Art. 28 del RGPD:",
                items: [
                    {
                        bold: "3.1 Supabase (Base de datos, Auth, Almacenamiento)",
                        text: "Utilizamos Supabase para la base de datos, autenticación (incluido inicio de sesión sin contraseña a través de Magic Links/PKCE) y almacenamiento (por ejemplo, para imágenes subidas). Los datos de la cuenta, perfil, spots, reseñas, comentarios, visitas programadas, estados de RSVP y otras subidas se procesan/almacenan allí."
                    },
                    {
                        bold: "3.2 Mapbox (Mapas)",
                        text: "Utilizamos Mapbox para mostrar el mapa interactivo. Mapbox está bloqueado por defecto y solo se carga tras su consentimiento; al aceptar, su dirección IP se transmite a Mapbox para recuperar contenido del mapa.",
                        basis: "Base legal: Art. 6 párr. 1 letra a del RGPD (Consentimiento a través del banner de cookies)."
                    },
                    {
                        bold: "3.3 Google Translate (Traducciones)",
                        text: "Integramos Google Translate en el cliente para traducir contenido de forma dinámica (por ejemplo, reseñas/descripciones). El servicio se carga solo tras la acción del usuario (activación)."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies / Almacenamiento Local",
                desc: "Almacenamos exclusivamente configuraciones funcionales en el almacenamiento local:",
                items: [
                    "efoilmap-consent: Guarda la elección del banner de cookies",
                    "efoilmap-lang: Guarda la selección del idioma",
                    "efoilmap-intro-dismissed: Marca que indica si se ha leído la bienvenida"
                ],
                outro: "No hay scripts publicitarios o de seguimiento de terceros activos en este sitio."
            },
            deletion: {
                title: "5. Período de Retención / Eliminación",
                desc: "Por lo general, almacenamos los datos de la cuenta personal mientras exista su perfil. Si decide eliminar su cuenta, se activa lo siguiente:",
                items: [
                    "Los datos de perfil, fotos de avatar, reseñas, comentarios de coordinación, visitas programadas y estados de RSVP/asistencia se destruyen de forma permanente y en cascada.",
                    "Las contribuciones de spots permanecen intactas pero se anonimizan (la autoría se establece en 'null') para que el mapa de la comunidad siga siendo funcional."
                ]
            },
            rights: {
                title: "6. Derechos de los Interesados",
                desc: "De acuerdo con el RGPD, tiene los siguientes derechos en particular:",
                items: [
                    "Art. 15 RGPD: Derecho de acceso",
                    "Art. 16 RGPD: Derecho de rectificación",
                    "Art. 17 RGPD: Derecho de supresión",
                    "Art. 18 RGPD: Derecho a la limitación del tratamiento",
                    "Art. 21 RGPD: Derecho de oposición",
                    "Art. 20 RGPD: Derecho a la portabilidad de datos",
                    "Art. 77 RGPD: Derecho a presentar una reclamación ante una autoridad de control"
                ],
                outro: "Para ejercer sus derechos, póngase en contacto con nosotros por correo electrónico (ver arriba)."
            },
            supervisory: {
                title: "7. Derecho a Presentar una Reclamación ante una Autoridad de Control",
                desc: "Puede presentar una reclamación ante una autoridad de control de protección de datos. Por lo general, es competente la autoridad de su lugar de residencia, lugar de trabajo o lugar de la supuesta infracción (Art. 77 del RGPD)."
            },
            changes: {
                title: "8. Cambios a esta Política de Privacidad",
                desc: "Esta política de privacidad puede adaptarse a medida que se desarrolle la plataforma. Se aplica la versión actualmente publicada en el sitio (ver fecha arriba)."
            }
        }
    },
    fr: {
        title: "Politique de Confidentialité (efoilmap.com)",
        lastUpdated: "Dernière mise à jour : 25 mai 2026",
        backToMap: "Retour à la Carte",
        intro: "Cette politique de confidentialité explique quelles données personnelles nous traitons sur efoilmap.com, à quelles fins, sur quelle base juridique et quels droits vous avez.",
        sections: {
            controller: {
                title: "1. Responsable du Traitement",
                desc: "L'entité responsable du traitement des données sur ce site conformément au Règlement Général sur la Protection des Données (RGPD) est :",
                company: "Angelpower UG (responsabilité limitée)",
                address: "Belvedereallee 5, 52070 Aix-la-Chapelle, Allemagne",
                email: "E-mail : hi@efoilmap.com",
                represented: "Représenté par : Carlo Matic"
            },
            collection: {
                title: "2. Traitement des Données Personnelles (Fins, Catégories de Données, Bases Juridiques)",
                desc: "Nous ne traitons les données personnelles que dans la mesure nécessaire pour assurer le bon fonctionnement de la plateforme et de la carte interactive. Cela comprend :",
                items: [
                    {
                        bold: "2.1 Compte Utilisateur et Inscription (Magic Link)",
                        text: "Données traitées : Adresse e-mail ; détails du profil le cas échéant (nom d'utilisateur, biographie) ; image d'avatar téléchargée par vous le cas échéant. Fins : Inscription/Connexion, gestion de compte, fourniture de fonctions communautaires.",
                        basis: "Base juridique : Art. 6 par. 1 lit. b du RGPD (Contrat/conditions d'utilisation)."
                    },
                    {
                        bold: "2.2 Contenu Généré par l'Utilisateur (Spots, Avis, Contenu)",
                        text: "Données traitées : Contenu soumis par vous tel que les coordonnées de spots, descriptions, équipements, avis/évaluations, photos le cas échéant, visites planifiées (y compris date, heure et description facultative), commentaires de coordination et statuts de présence/RSVP. Fins : Affichage et maintenance de la carte interactive de la communauté, partage et rencontres.",
                        basis: "Bases juridiques : Art. 6 par. 1 lit. b du RGPD (Fourniture de fonctions de la plateforme) et Art. 6 par. 1 lit. f du RGPD (intérêt légitime dans le fonctionnement, la qualité et l'intégrité des données)."
                    },
                    {
                        bold: "2.3 Fichiers Journaux Techniques",
                        text: "Données traitées : Données de connexion/accès (par exemple, adresse IP, date/heure, type de navigateur, URL de référence). Fins : Assurer la sécurité et la stabilité, analyse des erreurs, prévention des abus/spam.",
                        basis: "Base juridique : Art. 6 par. 1 lit. f du RGPD (intérêt légitime pour la sécurité)."
                    }
                ]
            },
            processors: {
                title: "3. Destinataires / Sous-Traitants et Transferts vers des Pays Tiers",
                desc: "Nous faisons appel à des prestataires de services qui traitent des données personnelles pour notre compte (sous-traitants). Des contrats de sous-traitance conformes à l'Art. 28 du RGPD ont été conclus avec eux :",
                items: [
                    {
                        bold: "3.1 Supabase (Base de données, Auth, Stockage)",
                        text: "Nous utilisons Supabase pour la base de données, l'authentification (y compris connexion sans mot de passe via Magic Links/PKCE) et le stockage (par exemple, pour les images téléchargées). Les données de compte, profils, spots, avis, commentaires, visites planifiées, statuts de présence/RSVP et autres téléchargements y sont stockés/traités."
                    },
                    {
                        bold: "3.2 Mapbox (Cartes)",
                        text: "Nous utilisons Mapbox pour afficher la carte interactive. Mapbox est bloqué par défaut et chargé uniquement après votre consentement ; avec votre consentement, votre adresse IP est transmise à Mapbox pour récupérer le contenu de la carte.",
                        basis: "Base juridique : Art. 6 par. 1 lit. a du RGPD (Consentement via le bandeau cookies)."
                    },
                    {
                        bold: "3.3 Google Translate (Traductions)",
                        text: "Nous intégrons Google Translate sur le client pour traduire dynamiquement le contenu (par exemple, avis/descriptions). Le service n'est chargé qu'après l'action de l'utilisateur (activation)."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies / Stockage Local",
                desc: "Nous utilisons le stockage local strictement pour enregistrer les préférences opérationnelles :",
                items: [
                    "efoilmap-consent : Enregistre le choix pour le bandeau de cookies",
                    "efoilmap-lang : Enregistre le choix de la langue",
                    "efoilmap-intro-dismissed : Indique si le message de bienvenue a été lu"
                ],
                outro: "Aucun pixel de suivi tiers ou script publicitaire n'est actif sur ce site."
            },
            deletion: {
                title: "5. Durée de Conservation / Suppression",
                desc: "Nous conservons généralement les données de compte tant que votre profil existe. Si vous décidez de supprimer votre profil, ce qui suit est déclenché :",
                items: [
                    "Toutes les données de profil, photos d'avatar, avis, commentaires de coordination, visites planifiées et statuts de présence/RSVP sont détruits de manière permanente et en cascade.",
                    "Les contributions de spots restent intactes mais sont anonymisées (l'auteur est défini sur 'null') pour que la carte reste opérationnelle."
                ]
            },
            rights: {
                title: "6. Droits des Personnes Concernées",
                desc: "Conformément au RGPD, vous disposez notamment des droits suivants :",
                items: [
                    "Art. 15 RGPD : Droit d'accès",
                    "Art. 16 RGPD : Droit de rectification",
                    "Art. 17 RGPD : Droit à l'effacement",
                    "Art. 18 RGPD : Droit à la limitation du traitement",
                    "Art. 21 RGPD : Droit d'opposition",
                    "Art. 20 RGPD : Droit à la portabilité des données",
                    "Art. 77 RGPD : Droit de déposer une plainte auprès d'une autorité de contrôle"
                ],
                outro: "Pour exercer vos droits, veuillez nous contacter par e-mail (voir ci-dessus)."
            },
            supervisory: {
                title: "7. Droit de Déposer une Plainte auprès d'une Autorité de Contrôle",
                desc: "Vous pouvez déposer une plainte auprès d'une autorité de contrôle de la protection des données. En règle générale, l'autorité de votre lieu de résidence, de votre lieu de travail ou du lieu de l'infraction présumée est compétente (Art. 77 du RGPD)."
            },
            changes: {
                title: "8. Modifications de cette Politique de Confidentialité",
                desc: "Cette politique de confidentialité peut être adaptée au fil de l'évolution de la plateforme. La version actuellement publiée s'applique (voir date ci-dessus)."
            }
        }
    },
    it: {
        title: "Informativa sulla Privacy (efoilmap.com)",
        lastUpdated: "Ultimo aggiornamento: 25 maggio 2026",
        backToMap: "Torna alla Mappa",
        intro: "Questa informativa sulla privacy spiega quali dati personali trattiamo su efoilmap.com, per quali scopi, su quale base giuridica e quali diritti hai.",
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
                title: "2. Trattamento dei Dati Personali (Scopi, Categorie di Dati, Basi Giuridiche)",
                desc: "Trattiamo i dati personali solo nella misura necessaria per fornire la piattaforma comunitaria e la mappa interattiva. Ciò include:",
                items: [
                    {
                        bold: "2.1 Account Utente e Registrazione (Magic Link)",
                        text: "Dati trattati: Indirizzo e-mail; dettagli del profilo se applicabile (nome utente, biografia); immagine del profilo caricata da te se applicabile. Scopi: Registrazione/Accesso, gestione dell'account, fornitura di funzioni comunitarie.",
                        basis: "Base giuridica: Art. 6 par. 1 lett. b GDPR (Rapporto di contratto/condizioni d'uso)."
                    },
                    {
                        bold: "2.2 Contenuto Generato dall'Utente (Spots, Recensioni, Contenuto)",
                        text: "Dati trattati: Contenuto inviato da te come coordinate di spot, descrizioni, servizi, recensioni/valutazioni, foto se applicabile, visite programmate (inclusi data, ora e descrizione opzionale), commenti di coordinamento e stato di RSVP/partecipazione. Scopi: Visualizzazione e manutenzione della mappa interattiva della comunità, condivisione e incontri nella comunità.",
                        basis: "Basi giuridiche: Art. 6 par. 1 lett. b GDPR (Fornitura di funzioni della piattaforma) e Art. 6 par. 1 lett. f GDPR (legittimo interesse al funzionamento, alla qualità e all'integrità dei dati della comunità)."
                    },
                    {
                        bold: "2.3 File di Registro Tecnici",
                        text: "Dati trattati: Dati di connessione/accesso (ad esempio indirizzo IP, data/ora, tipo di browser, URL di riferimento). Scopi: Garantire la sicurezza e la stabilità, analisi degli errori, prevenzione di abusi/spam.",
                        basis: "Base giuridica: Art. 6 par. 1 lett. f GDPR (legittimo interesse per la sicurezza)."
                    }
                ]
            },
            processors: {
                title: "3. Destinatari / Responsabili Esterni e Trasferimenti verso Paesi Terzi",
                desc: "Utilizziamo fornitori di servizi che trattano dati personali per nostro conto (responsabili). Con questi sono stati stipulati contratti di trattamento conformi all'Art. 28 GDPR:",
                items: [
                    {
                        bold: "3.1 Supabase (Database, Auth, Storage)",
                        text: "Utilizziamo Supabase per database, autenticazione (incluso accesso senza password tramite Magic Links/PKCE) e archiviazione (ad esempio per foto caricate). I dati dell'account, percorsi di profilo, spot, recensioni, commenti, visite pianificate, RSVP e altri caricamenti sono memorizzati/trattati lì."
                    },
                    {
                        bold: "3.2 Mapbox (Mappe)",
                        text: "Utilizziamo Mapbox per visualizzare la mappa interattiva. Mapbox è bloccato per impostazione predefinita e viene caricato solo previo consenso; in caso di consenso, l'indirizzo IP viene inviato a Mapbox per caricare le mappe.",
                        basis: "Base giuridica: Art. 6 par. 1 lett. a GDPR (Consenso tramite banner dei cookie)."
                    },
                    {
                        bold: "3.3 Google Translate (Traduzioni)",
                        text: "Integriamo Google Translate sul client per tradurre in modo dinamico i contenuti (ad esempio recensioni/descrizioni). Il servizio viene caricato solo a seguito dell'azione dell'utente (attivazione)."
                    }
                ]
            },
            cookies: {
                title: "4. Cookie / Memoria Locale",
                desc: "Utilizziamo la memoria locale esclusivamente per salvare le preferenze operative:",
                items: [
                    "efoilmap-consent: Memorizza la scelta del banner dei cookie",
                    "efoilmap-lang: Memorizza la lingua selezionata",
                    "efoilmap-intro-dismissed: Ricorda se hai letto il messaggio di benvenuto"
                ],
                outro: "Su questo sito non sono attivi cookie di tracciamento di terze parti o script pubblicitari."
            },
            deletion: {
                title: "5. Conservazione dei Dati / Cancellazione",
                desc: "I tuoi dati personali vengono conservati finché esiste il tuo profilo. Se decidi di cancellare il tuo profilo, si attiva quanto segue:",
                items: [
                    "Tutti i dati del profilo, le foto d'avatar, le recensioni, i commenti di coordinamento, le visite programmate e lo stato di RSVP/partecipazione vengono distrutti in modo permanente e a cascata.",
                    "I contributi degli spot rimangono intatti ma vengono resi anonimi (l'autore viene impostato su 'null') per garantire la funzionalità della mappa."
                ]
            },
            rights: {
                title: "6. Diritti degli Interessati",
                desc: "Ai sensi del GDPR, disponi in particolare dei seguenti diritti:",
                items: [
                    "Art. 15 GDPR: Diritto di accesso",
                    "Art. 16 GDPR: Diritto di rettifica",
                    "Art. 17 GDPR: Diritto alla cancellazione",
                    "Art. 18 GDPR: Diritto alla limitazione del trattamento",
                    "Art. 21 GDPR: Diritto di opposizione",
                    "Art. 20 GDPR: Diritto alla portabilità dei dati",
                    "Art. 77 GDPR: Diritto di proporre reclamo a un'autorità di controllo"
                ],
                outro: "Per esercitare i tuoi diritti, ti preghiamo di contattarci via e-mail (vedi sopra)."
            },
            supervisory: {
                title: "7. Diritto di Proporre Reclamo a un'Autorità di Controllo",
                desc: "Puoi proporre reclamo a un'autorità di controllo della protezione dei dati. In genere, è competente l'autorità del tuo luogo di residenza, luogo di lavoro o del luogo della presunta violazione (Art. 77 GDPR)."
            },
            changes: {
                title: "8. Modifiche a questa Informativa sulla Privacy",
                desc: "Questa informativa sulla privacy può essere modificata con lo sviluppo della piattaforma. Si applica la versione attualmente pubblicata (vedi data sopra)."
            }
        }
    },
    pt: {
        title: "Política de Privacidade (efoilmap.com)",
        lastUpdated: "Última atualização: 25 de maio de 2026",
        backToMap: "Volver al Mapa",
        intro: "Esta política de privacidade explica que dados pessoais processamos em efoilmap.com, para que fins, sobre que base legal e que direitos você tem.",
        sections: {
            controller: {
                title: "1. Responsável pelo Tratamento",
                desc: "A entidade responsável pelo tratamento de dados neste site em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD) é:",
                company: "Angelpower UG (responsabilidade limitada)",
                address: "Belvedereallee 5, 52070 Aachen, Alemanha",
                email: "Email: hi@efoilmap.com",
                represented: "Representado por: Carlo Matic"
            },
            collection: {
                title: "2. Tratamento de Dados Pessoais (Fins, Categorias de Dados, Bases Legais)",
                desc: "Tratamos dados pessoais apenas na medida do necessário para fornecer a plataforma comunitária e o mapa interativo. Isto inclui:",
                items: [
                    {
                        bold: "2.1 Conta de Utilizador e Registo (Magic Link)",
                        text: "Dados processados: Endereço de e-mail; detalhes do perfil se aplicável (nome de utilizador, biografia); imagem de avatar carregada por si se aplicável. Fins: Registo/Login, gestão da conta, prestação de funções comunitárias.",
                        basis: "Base legal: Art. 6º, par. 1, alínea b do RGPD (Relação de contrato/termos de utilização)."
                    },
                    {
                        bold: "2.2 Conteúdo Gerado pelo Utilizador (Spots, Avaliações, Conteúdo)",
                        text: "Dados processados: Conteúdo enviado por si, como coordenadas de spots, descrições, comodidades, avaliações/classificações, fotos se aplicável, visitas programadas (incluindo data, hora e descrição opcional), comentários de coordenação e estados de RSVP/presença. Fins: Exibição e manutenção do mapa comunitário interativo, partilha e encontros na comunidade.",
                        basis: "Bases legais: Art. 6º, par. 1, alínea b do RGPD (Prestação de funções da plataforma) e Art. 6º, par. 1, alínea f do RGPD (interesse legítimo no funcionamento, qualidade e integridade dos dados da comunidade)."
                    },
                    {
                        bold: "2.3 Ficheiros de Registo Técnico",
                        text: "Dados processados: Dados de ligação/acesso (por exemplo, endereço IP, data/hora, tipo de navegador, URL de referência). Fins: Garantir a segurança e estabilidade, análise de erros, prevenção de abusos/spam.",
                        basis: "Base legal: Art. 6º, par. 1, alínea f do RGPD (interesse legítimo na segurança)."
                    }
                ]
            },
            processors: {
                title: "3. Destinatários / Subcontratantes e Transferências para Terceiros Países",
                desc: "Utilizamos prestadores de serviços que processam dados pessoais em nosso nome (subcontratantes). Foram celebrados contratos de subcontratação nos termos do Art. 28º do RGPD com eles:",
                items: [
                    {
                        bold: "3.1 Supabase (Base de dados, Auth, Armazenamento)",
                        text: "Utilizamos Supabase para base de dados, autenticação (incluindo início de sessão sem palavra-passe através de Magic Links/PKCE) e armazenamento (por exemplo, para imagens carregadas). Os dados de conta, perfis, spots, avaliações, comentários, visitas programadas, RSVP e outros carregamentos são processados/armazenados lá."
                    },
                    {
                        bold: "3.2 Mapbox (Mapas)",
                        text: "Utilizamos Mapbox para mostrar o mapa interativo. O Mapbox está bloqueado por defeito e só é carregado após o seu consentimento; ao aceitar, o seu endereço IP é enviado ao Mapbox para carregar os mapas.",
                        basis: "Base legal: Art. 6º, par. 1, alínea a do RGPD (Consentimento através do banner de cookies)."
                    },
                    {
                        bold: "3.3 Google Translate (Traduções)",
                        text: "Integramos o Google Translate client-side para traduzir avaliações de forma dinâmica. O serviço só se ativa após a ação do utilizador (ativação)."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies / Armazenamento Local",
                desc: "Utilizamos o armazenamento local estritamente para guardar preferências operacionais:",
                items: [
                    "efoilmap-consent: Guarda a escolha no banner de cookies",
                    "efoilmap-lang: Guarda a seleção do idioma",
                    "efoilmap-intro-dismissed: Indica se a mensagem de boas-vindas foi lida"
                ],
                outro: "Não há scripts de publicidade ou monitorização de terceiros ativos neste site."
            },
            deletion: {
                title: "5. Retenção de Dados / Eliminação",
                desc: "Por norma, guardamos os dados da conta pessoal enquanto o seu perfil existir. Se decidir eliminar a sua conta, é ativado o seguinte:",
                items: [
                    "Todos os dados do perfil, fotos de avatar, avaliações, comentários de coordenação, visitas programadas e estados de RSVP/presença são permanente e kaskadierend destruídos.",
                    "As contribuições dos spots permanecem intactas mas são anonimizadas (a autoria é definida como 'null') para proteger a integridade do mapa."
                ]
            },
            rights: {
                title: "6. Direitos dos Titulares dos Dados",
                desc: "Nos termos do RGPD, dispõe dos seguintes direitos em particular:",
                items: [
                    "Art. 15º RGPD: Direito de acesso",
                    "Art. 16º RGPD: Direito de retificação",
                    "Art. 17º RGPD: Direito ao apagamento",
                    "Art. 18º RGPD: Droit à la limitation du traitement",
                    "Art. 21º RGPD: Direito de oposição",
                    "Art. 20º RGPD: Direito de portabilidade dos dados",
                    "Art. 77º RGPD: Direito a apresentar queixa junto de uma autoridade de controlo"
                ],
                outro: "Para exercer os seus direitos, contacte-nos através de e-mail (ver acima)."
            },
            supervisory: {
                title: "7. Direito a Apresentar Queixa junto de uma Autoridade de Controlo",
                desc: "Pode apresentar reclamação junto de uma autoridade de controlo de proteção de dados. Por norma, é competente a autoridade do seu local de residência, local de trabalho ou local da alegada infração (Art. 77º do RGPD)."
            },
            changes: {
                title: "8. Alterações a esta Política de Privacidade",
                desc: "Esta política de privacidade pode ser adaptada conforme a plataforma se desenvolva. Aplica-se a versão atualmente publicada no site (ver data acima)."
            }
        }
    },
    nl: {
        title: "Privacybeleid (efoilmap.com)",
        lastUpdated: "Laatst bijgewerkt: 25 mei 2026",
        backToMap: "Terug naar Kaart",
        intro: "Dit privacybeleid legt uit welke persoonsgegevens we op efoilmap.com verwerken, voor welke doeleinden, op welke wettelijke basis en welke rechten je hebt.",
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
                title: "2. Verwerking van Persoonsgegevens (Doeleinden, Gegevenscategorieën, Rechtsgronden)",
                desc: "Wij verzamelen en verwerken persoonsgegevens alleen voor zover dat nodig is om het community-platform en de interactieve kaart te bieden. Dit omvat:",
                items: [
                    {
                        bold: "2.1 Gebruikersaccount en Registratie (Magic Link)",
                        text: "Verwerkte gegevens: E-mailadres; profielgegevens indien van toepassing (gebruikersnaam, bio); door jou geüploade profielfoto indien van toepassing. Doeleinden: Registratie/Login, accountbeheer, levering van communityfuncties.",
                        basis: "Wettelijke grondslag: Art. 6 lid 1 sub b AVG (Overeenkomst/gebruikersvoorwaarden)."
                    },
                    {
                        bold: "2.2 User Generated Content (Spots, Beoordelingen, Inhoud)",
                        text: "Verwerkte gegevens: Door jou ingediende inhoud zoals spotcoördinaten, beschrijvingen, voorzieningen, beoordelingen/ratings, foto's indien van toepassing, geplande bezoeken (inclusief datum, tijd en optionele beschrijving), coördinatie-opmerkingen en RSVP/aanwezigheidsstatussen. Doeleinden: Weergave en onderhoud van de interactieve communitykaart, delen en ontmoetingen in de community.",
                        basis: "Wettelijke grondslagen: Art. 6 lid 1 sub b AVG (Levering van platformfuncties) en Art. 6 lid 1 sub f AVG (gerechtvaardigd belang bij de exploitatie, kwaliteit en integriteit van communitygegevens)."
                    },
                    {
                        bold: "2.3 Technische Logbestanden",
                        text: "Verwerkte gegevens: Verbindings-/toegangsgegevens (bijv. IP-adres, datum/tijd, browsertype, referrer-URL). Doeleinden: Zorgen voor veiligheid en stabiliteit, foutanalyse, misbruik-/spampreventie.",
                        basis: "Wettelijke grondslag: Art. 6 lid 1 sub f AVG (gerechtvaardigd belang bij veilige exploitatie)."
                    }
                ]
            },
            processors: {
                title: "3. Ontvangers / Verwerkers en Doorgifte naar Derde Landen",
                desc: "Wij maken gebruik van dienstverleners die namens ons persoonsgegevens verwerken (verwerkers). Met hen zijn verwerkersovereenkomsten gesloten in overeenstemming met Art. 28 AVG:",
                items: [
                    {
                        bold: "3.1 Supabase (Database, Auth, Storage)",
                        text: "We gebruiken Supabase voor onze database, authenticatie (inclusief wachtwoordloos inloggen via Magic Links/PKCE) en opslag (bijv. voor geüploade foto's). Accountgegevens, profielen, spots, beoordelingen, opmerkingen, geplande bezoeken, RSVP-statussen en andere uploads worden daar verwerkt/opgeslagen."
                    },
                    {
                        bold: "3.2 Mapbox (Kaarttegels)",
                        text: "We gebruiken Mapbox om de interactieve kaart weer te geven. Mapbox is standaard geblokkeerd en wordt pas geladen na jouw toestemming; bij toestemming wordt je IP-adres naar Mapbox verzonden om kaarten te laden.",
                        basis: "Wettelijke grondslag: Art. 6 lid 1 sub a AVG (Toestemming via de cookiebanner)."
                    },
                    {
                        bold: "3.3 Google Translate (Vertalingen)",
                        text: "We integreren Google Translate client-side om beoordelingen dynamisch te vertalen. Dit wordt alleen geactiveerd op verzoek van de gebruiker (trigger)."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies / Lokale Opslag",
                desc: "We gebruiken lokale opslag uitsluitend om operationele voorkeuren op te slaan:",
                items: [
                    "efoilmap-consent: Slaat de keuze voor de cookiebanner op",
                    "efoilmap-lang: Slaat de taalselectie op",
                    "efoilmap-intro-dismissed: Geeft aan of het onboarding-bericht is gelezen"
                ],
                outro: "Er zijn geen trackingspixels van derden of advertentiescripts actief op deze website."
            },
            deletion: {
                title: "5. Bewaartermijn / Verwijdering",
                desc: "We bewaren persoonlijke accountgegevens in principe zolang je profiel bestaat. Als je besluit je profiel te verwijderen, wordt het volgende geactiveerd:",
                items: [
                    "Alle profielvelden, profielfoto's, beoordelingen, coördinatie-opmerkingen, geplande bezoeken en RSVP/aanwezigheidsstatussen worden definitief en trapsgewijs (cascading) verwijderd.",
                    "Spotbijdragen blijven intact maar worden geanonimiseerd (het auteurschap wordt ingesteld op 'null') zodat de communitykaart functioneel blijft."
                ]
            },
            rights: {
                title: "6. Rechten van Betrokkene",
                desc: "Onder de AVG heb je in het bijzonder de volgende rechten:",
                items: [
                    "Art. 15 AVG: Recht op inzage",
                    "Art. 16 AVG: Recht op rectificatie",
                    "Art. 17 AVG: Recht op gegevenswissing",
                    "Art. 18 AVG: Recht op beperking van de verwerking",
                    "Art. 21 AVG: Recht op bezwaar",
                    "Art. 20 AVG: Recht op gegevensoverdraagbaarheid",
                    "Art. 77 AVG: Recht om een klacht in te dienen bij een toezichthoudende autoriteit"
                ],
                outro: "Om je rechten uit te oefenen, kun je contact met ons opnemen via e-mail (zie hierboven)."
            },
            supervisory: {
                title: "7. Recht om een Klacht in te dienen bij een Toezichthoudende Autoriteit",
                desc: "Je kunt een klacht indienen bij een toezichthoudende autoriteit voor gegevensbescherming. In de regel is de toezichthoudende autoriteit van je gewone verblijfplaats, werkplek of plaats van de vermeende inbreuk bevoegd (Art. 77 AVG)."
            },
            changes: {
                title: "8. Wijzigingen in dit Privacybeleid",
                desc: "Dit privacybeleid kan worden aangepast naarmate het platform zich ontwikkelt. De versie die momenteel op de website is gepubliceerd is van toepassing (zie datum hierboven)."
            }
        }
    },
    pl: {
        title: "Polityka Prywatności (efoilmap.com)",
        lastUpdated: "Ostatnia aktualizacja: 25 maja 2026",
        backToMap: "Powrót do Mapy",
        intro: "Niniejsza polityka prywatności wyjaśnia, jakie dane osobowe przetwarzamy na efoilmap.com, w jakich celach, na jakiej podstawie prawnej i jakie prawa Ci przysługują.",
        sections: {
            controller: {
                title: "1. Administrator Danych Osobowych",
                desc: "Podmiotem odpowiedzialnym za przetwarzanie danych na tej stronie internetowej w rozumieniu RODO jest:",
                company: "Angelpower UG (z ograniczoną odpowiedzialnością)",
                address: "Belvedereallee 5, 52070 Akwizgran, Niemcy",
                email: "Email: hi@efoilmap.com",
                represented: "Reprezentowany przez: Carlo Matic"
            },
            collection: {
                title: "2. Przetwarzanie Danych Osobowych (Cele, Kategorie Danych, Podstawy Prawne)",
                desc: "Przetwarzamy dane osobowe wyłącznie w zakresie niezbędnym do zapewnienia funkcjonowania platformy społecznościowej i interaktywnej mapy. Obejmuje to:",
                items: [
                    {
                        bold: "2.1 Konto Użytkownika i Rejestracja (Magic Link)",
                        text: "Przetwarzane dane: Adres e-mail; szczegóły profilu w stosownych przypadkach (nazwa użytkownika, biogram); przesłane zdjęcie profilowe w stosownych przypadkach. Cele: Rejestracja/Logowanie, zarządzanie kontem, dostarczanie funkcji społecznościowych.",
                        basis: "Podstawa prawna: Art. 6 ust. 1 lit. b RODO (Umowa/warunki korzystania)."
                    },
                    {
                        bold: "2.2 Treści Generowane przez Użytkowników (Spoty, Recenzje, Treści)",
                        text: "Przetwarzane dane: Treści przesłane przez Ciebie, takie jak współrzędne spotów, opisy, udogodnienia, opinie społeczności, zaplanowane wizyty (w tym data, godzina i opcjonalny opis), komentarze koordynacyjne oraz statusy obecności/RSVP. Cele: Wyświetlanie i utrzymanie interaktywnej mapy, wymiana informacji i spotkania w społeczności.",
                        basis: "Podstawy prawne: Art. 6 ust. 1 lit. b RODO (Dostarczanie funkcji platformy) i Art. 6 ust. 1 lit. f RODO (uzasadniony interes w prowadzeniu, jakości i integralności danych społeczności)."
                    },
                    {
                        bold: "2.3 Techniczne Pliki Dziennika",
                        text: "Przetwarzane dane: Dane o połączeniu/dostępie (np. adres IP, data/godzina, typ przeglądarki, URL strony odsyłającej). Cele: Zapewnienie bezpieczeństwa i stabilności, analiza błędów, zapobieganie nadużyciom/spamowi.",
                        basis: "Podstawa prawna: Art. 6 ust. 1 lit. f RODO (uzasadniony interes w bezpiecznym prowadzeniu)."
                    }
                ]
            },
            processors: {
                title: "3. Odbiorcy / Podmioty Przetwarzające i Transfery do Państw Trzecich",
                desc: "Korzystamy z usług dostawców, którzy przetwarzają dane osobowe w naszym imieniu (podmioty przetwarzające). Zostały z nimi podpisane umowy powierzenia przetwarzania danych zgodnie z Art. 28 RODO:",
                items: [
                    {
                        bold: "3.1 Supabase (Baza danych, Auth, Przechowywanie)",
                        text: "Używamy Supabase do bazy danych, uwierzytelniania (w tym logowania bez hasła przez Magic Links/PKCE) oraz przechowywania plików (np. przesłanych zdjęć). Dane konta, profile, spoty, recenzje, komentarze, zaplanowane wizyty, statusy RSVP i inne przesłane pliki są tam przetwarzane/przechowywane."
                    },
                    {
                        bold: "3.2 Mapbox (Mapy)",
                        text: "Używamy Mapbox do wyświetlania mapy. Mapbox jest domyślnie zablokowany i ładowany dopiero po wyrażeniu zgody; po jej wyrażeniu Twój adres IP jest wysyłany do Mapbox w celu pobrania zawartości mapy.",
                        basis: "Podstawa prawna: Art. 6 ust. 1 lit. a RODO (Zgoda za pośrednictwem baneru cookies)."
                    },
                    {
                        bold: "3.3 Google Translate (Tłumaczenia)",
                        text: "Dynamicznie tłumaczymy opinie client-side przy użyciu Google Translate. Usługa ta jest aktywowana wyłącznie na żądanie użytkownika (trigger)."
                    }
                ]
            },
            cookies: {
                title: "4. Pliki Cookies / Pamięć Lokalna",
                desc: "Używamy pamięci lokalnej wyłącznie do zapisywania preferencji operacyjnych:",
                items: [
                    "efoilmap-consent: Zapisuje wybór w banerze cookies",
                    "efoilmap-lang: Zapisuje wybrany język",
                    "efoilmap-intro-dismissed: Zapamiętuje, czy przeczytano onboarding"
                ],
                outro: "Na tej stronie nie są aktywne żadne pliki cookie śledzące stron trzecich ani skrypty reklamowe."
            },
            deletion: {
                title: "5. Okres Przechowywania / Usuwanie",
                desc: "Zasada jest taka, że dane konta osobistego przechowujemy tak długo, jak długo istnieje Twój profil. Jeśli zdecydujesz się usunąć konto, nastąpi:",
                items: [
                    "Wszystkie dane profilu, zdjęcia profilowe, opinie, komentarze koordynacyjne, zaplanowane wizyty i statusy RSVP/obecności zostaną trwale i kaskadowo usunięte.",
                    "Wpisy dotyczące spotów pozostają nienaruszone, ale zostają zanonimizowane (autorsko ustawione na 'null'), aby mapa społeczności pozostała funkcjonalna."
                ]
            },
            rights: {
                title: "6. Prawa Osób, Których Dane Dotyczą",
                desc: "Zgodnie z RODO przysługują Ci w szczególności następujące prawa:",
                items: [
                    "Art. 15 RODO: Prawo dostępu do danych",
                    "Art. 16 RODO: Prawo do sprostowania danych",
                    "Art. 17 RODO: Prawo do usunięcia danych",
                    "Art. 18 RODO: Prawo do ograniczenia przetwarzania",
                    "Art. 21 RODO: Prawo do sprzeciwu",
                    "Art. 20 RODO: Prawo do przenoszenia danych",
                    "Art. 77 RODO: Prawo do wniesienia skargi do organu nadzorczego"
                ],
                outro: "Aby skorzystać ze swoich praw, skontaktuj się z nami poprzez e-mail (patrz wyżej)."
            },
            supervisory: {
                title: "7. Prawo do Wniesienia Skargi do Organu Nadzorczego",
                desc: "Możesz wnieść skargę do organu nadzorczego ochrony danych. Zazwyczaj właściwy jest organ w Twoim stałym miejscu zamieszkania, miejscu pracy lub miejscu popełnienia domniemanego naruszenia (Art. 77 RODO)."
            },
            changes: {
                title: "8. Zmiany w niniejszej Polityce Prywatności",
                desc: "Polityka prywatności może być dostosowywana w miarę rozwoju platformy. Obowiązuje wersja aktualnie opublikowana na stronie (patrz data powy)."
            }
        }
    },
    sv: {
        title: "Integritetspolicy (efoilmap.com)",
        lastUpdated: "Senast uppdaterad: 25 maj 2026",
        backToMap: "Tillbaka till Kartan",
        intro: "Denna integritetspolicy förklarar vilka personuppgifter vi behandlar på efoilmap.com, för vilka ändamål, på vilken rättslig grund och vilka rättigheter du har.",
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
                title: "2. Behandling av Personuppgifter (Ändamål, Kategorier av Uppgifter, Rättsliga Grunder)",
                desc: "Vi samlar in och behandlar personuppgifter endast i den utsträckning det är nödvändigt för att tillhandahålla community-plattformen och den interaktiva kartan. Detta inkluderar:",
                items: [
                    {
                        bold: "2.1 Användarkonto och Registrering (Magic Link)",
                        text: "Behandlade uppgifter: E-postadress; profiluppgifter om tillämpligt (användarnamn, biografi); profilbild uppladdad av dig om tillämpligt. Ändamål: Registrering/Login, kontoadministration, tillhandahållande av community-funktioner.",
                        basis: "Rättslig grund: Art. 6 para. 1 lit. b GDPR (Avtal/användningsförhållande)."
                    },
                    {
                        bold: "2.2 Användargenererat Innehåll (Spots, Recensioner, Innehåll)",
                        text: "Behandlade uppgifter: Innehåll som du publicerar, t.ex. platskoordinater, beskrivningar, bekvämligheter, community-recensioner, planerade besök (inklusive datum, tid och valfri beskrivning), samordningskommentarer och RSVP/närvarostatus. Ändamål: Visning och underhåll av den interaktiva community-kartan, samarbete och möten.",
                        basis: "Rättsliga grunder: Art. 6 para. 1 lit. b GDPR (Tillhandahållande av plattformsfunktioner) och Art. 6 para. 1 lit. f GDPR (berättigat intresse av plattformens drift, kvalitet och integritet)."
                    },
                    {
                        bold: "2.3 Tekniska Loggfiler",
                        text: "Behandlade uppgifter: Anslutnings-/åtkomstdata (t.ex. IP-adress, datum/tid, webbläsartyp, hänvisnings-URL). Ändamål: Säkerställa säkerhet och stabilitet, felanalys, spambekämpning.",
                        basis: "Rättslig grund: Art. 6 para. 1 lit. f GDPR (berättigat intresse av säker drift)."
                    }
                ]
            },
            processors: {
                title: "3. Mottagare / Personuppgiftsbiträden och Överföringar till Tredje Land",
                desc: "Vi använder tjänsteleverantörer som behandlar personuppgifter för vår räkning (biträden). Biträdesavtal i enlighet med Art. 28 GDPR har tecknats med dem:",
                items: [
                    {
                        bold: "3.1 Supabase (Databas, Auth, Storage)",
                        text: "Vi använder Supabase för databas, autentisering (inklusive lösenordslös inloggning via Magic Links/PKCE) och lagring (t.ex. för uppladdade bilder). Kontouppgifter, profilinformation, spots, recensioner, kommentarer, planerade besök, RSVP-statuser och övriga uppladdningar sparas/behandlas där."
                    },
                    {
                        bold: "3.2 Mapbox (Kartan)",
                        text: "Vi använder Mapbox för att visa kartan. Mapbox är blockerad som standard och laddas först efter ditt samtycke; vid samtycke skickas din IP-adress till Mapbox för att ladda kartor.",
                        basis: "Rättslig grund: Art. 6 para. 1 lit. a GDPR (Samtycke via cookie-banderollen)."
                    },
                    {
                        bold: "3.3 Google Translate (Översättningar)",
                        text: "Vi integrerar Google Translate client-side för att dynamiskt översätta innehåll (t.ex. recensioner/beskrivningar). Tjänsten aktiveras endast på begäran av användaren (trigger)."
                    }
                ]
            },
            cookies: {
                title: "4. Cookies / Lokal Lagring",
                desc: "Vi använder lokal lagring uteslutande för att spara driftsinställningar:",
                items: [
                    "efoilmap-consent: Lagrar valet i cookie-banderollen",
                    "efoilmap-lang: Lagrar språkvalet",
                    "efoilmap-intro-dismissed: Kommer ihåg om välkomstmeddelandet har lästs"
                ],
                outro: "Inga spårningspixlar eller annonsskript från tredje part är aktiva på denna webbplats."
            },
            deletion: {
                title: "5. Datalagring / Radering",
                desc: "Vi lagrar personuppgifter i princip så länge din profil finns kvar. Om du väljer att radera din profil händer följande:",
                items: [
                    "Alla profilfält, profilbilder, recensioner, samordningskommentarer, planerade besök och RSVP/närvarostatusar raderas permanent och kaskadartat.",
                    "Spot-bidrag anonymiseras (författarskapet sätts till 'null') så att community-kartan förblir funktionell."
                ]
            },
            rights: {
                title: "6. Dina Rättigheter som Registrerad",
                desc: "Enligt GDPR har du följande rättigheter i synnerhet:",
                items: [
                    "Art. 15 GDPR: Rätt till tillgång",
                    "Art. 16 GDPR: Rätt till rättelse",
                    "Art. 17 GDPR: Rätt till radering",
                    "Art. 18 GDPR: Rätt till begränsning",
                    "Art. 21 GDPR: Rätt att invända",
                    "Art. 20 GDPR: Rätt till dataportabilitet",
                    "Art. 77 GDPR: Rätt att klaga hos en tillsynsmyndighet"
                ],
                outro: "För att utöva dina rättigheter, maila oss direkt på e-postadressen ovan."
            },
            supervisory: {
                title: "7. Rätt att Klaga hos en Tillsynsmyndighet",
                desc: "Du kan lämna in ett klagomål till en tillsynsmyndighet. Vanligtvis är tillsynsmyndigheten på din bosättningsort, arbetsplats eller platsen för det påstådda intrånget behörig (Art. 77 GDPR)."
            },
            changes: {
                title: "8. Ändringar i denna Integritetspolicy",
                desc: "Denna integritetspolicy kan justeras när plattformen utvecklas. Den version som för närvarande är publicerad på webbplatsen gäller (se datum ovan)."
            }
        }
    }
};

export default function Privacy() {
    const { locale } = useLanguage();
    const t = (locale as string) in content ? content[locale as keyof typeof content] : content.en;

    return (
        <div className="h-full overflow-y-auto bg-background text-foreground p-8 leading-relaxed relative flex flex-col justify-between">
            <div className="max-w-3xl mx-auto space-y-8 pb-20 w-full">
                <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                    <ArrowLeft className="w-4 h-4" />
                    {t.backToMap}
                </Link>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight">{t.title}</h1>
                    <p className="text-xs text-muted-foreground">{t.lastUpdated}</p>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed bg-card border border-border p-4 rounded-xl">
                    {t.intro}
                </p>

                <section className="space-y-8 text-sm">
                    {/* 1. Controller */}
                    <div className="space-y-3 bg-card border border-border p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.controller.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.controller.desc}
                        </p>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-1 text-muted-foreground text-xs leading-normal">
                            <p className="font-semibold text-foreground">{t.sections.controller.company}</p>
                            <p>{t.sections.controller.address}</p>
                            <p>{t.sections.controller.represented}</p>
                            <p>{t.sections.controller.email}</p>
                        </div>
                    </div>

                    {/* 2. Collection & Processing of Personal Data */}
                    <div className="space-y-3 bg-card border border-border p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.collection.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.collection.desc}
                        </p>
                        <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                            {t.sections.collection.items.map((item, idx) => (
                                <li key={idx}>
                                    <strong className="text-foreground">{item.bold}</strong>
                                    <p className="mt-1 text-sm leading-relaxed">{item.text}</p>
                                    {item.basis && (
                                        <span className="block text-xs italic text-muted-foreground mt-1">
                                            {item.basis}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Third-Party Services */}
                    <div className="space-y-3 bg-card border border-border p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.processors.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.processors.desc}
                        </p>
                        <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                            {t.sections.processors.items.map((item, idx) => (
                                <li key={idx}>
                                    <strong className="text-foreground">{item.bold}</strong>
                                    <p className="mt-1 text-sm leading-relaxed">{item.text}</p>
                                    {item.basis && (
                                        <span className="block text-xs italic text-muted-foreground mt-1">
                                            {item.basis}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Cookies & LocalStorage */}
                    <div className="space-y-3 bg-card border border-border p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.cookies.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.cookies.desc}
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {t.sections.cookies.items.map((item, idx) => (
                                <li key={idx} className="text-sm">
                                    <code className="text-xs text-foreground bg-muted px-1.5 py-0.5 rounded font-mono border border-border">
                                        {item.split(":")[0]}
                                    </code>
                                    : {item.split(":")[1]}
                                </li>
                            ))}
                        </ul>
                        <p className="text-xs text-muted-foreground italic mt-3 pt-3 border-t border-border">
                            {t.sections.cookies.outro}
                        </p>
                    </div>

                    {/* 5. Account Deletion & Data Retention */}
                    <div className="space-y-3 bg-card border border-border p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.deletion.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.deletion.desc}
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {t.sections.deletion.items.map((item, idx) => (
                                <li key={idx} className="text-sm leading-relaxed">{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* 6. Your Legal Rights */}
                    <div className="space-y-3 bg-card border border-border p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.rights.title}</h2>
                        <p className="text-muted-foreground">
                            {t.sections.rights.desc}
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            {t.sections.rights.items.map((item, idx) => (
                                <li key={idx} className="text-sm">
                                    <strong className="text-foreground">{item.split(":")[0]}</strong>
                                    {item.split(":")[1] ? `:${item.split(":")[1]}` : ""}
                                </li>
                            ))}
                        </ul>
                        <p className="text-muted-foreground text-xs mt-3 pt-3 border-t border-border">
                            {t.sections.rights.outro}
                        </p>
                    </div>

                    {/* 7. Right to lodge a complaint with a supervisory authority */}
                    <div className="space-y-3 bg-card border border-border p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.supervisory.title}</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {t.sections.supervisory.desc}
                        </p>
                    </div>

                    {/* 8. Changes to this Privacy Policy */}
                    <div className="space-y-3 bg-card border border-border p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-foreground">{t.sections.changes.title}</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {t.sections.changes.desc}
                        </p>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}
