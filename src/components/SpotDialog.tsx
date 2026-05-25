"use client";

import { X, BatteryCharging, Utensils, Car, Camera, ThumbsUp, Loader2, Star, Share2, Sparkles, User as UserIcon, Calendar, Clock, ChevronLeft, ChevronRight, Plus, MessageSquare, Store, Heart, Bookmark } from "lucide-react";
import Image from "next/image";
import { Spot, createSpotVisit, addVisitComment, joinOrCancelVisit, deleteSpotVisit, updateVisitComment, deleteVisitComment, updateSpotReview, deleteSpotReview, toggleLikeSpot, getSpotLikesCount, getSpotLikeStatus, toggleBookmarkSpot, getSpotQuestionsAndAnswers, createSpotQuestion, createSpotAnswer, SpotQuestion, SpotAnswer } from "@/app/actions";
import { useSearchParams } from "next/navigation";
import { Trash2, Edit2, Check } from "lucide-react";

const addedByText: Record<string, string> = {
    en: "Added by",
    de: "Hinzugefügt von",
    es: "Añadido por",
    fr: "Ajouté par",
    it: "Aggiunto da",
    pt: "Adicionado por",
    nl: "Toegevoegd door",
    pl: "Dodane przez",
    sv: "Tillagd av"
};

const monthNames: Record<string, string[]> = {
    de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

const weekdays: Record<string, string[]> = {
    de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
};

function getYoutubeId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function renderTextWithLinks(text: string | undefined, onYoutubeClick?: (videoId: string) => void): React.ReactNode {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            const href = part.startsWith("www.") ? `https://${part}` : part;
            const youtubeId = getYoutubeId(href);
            
            if (youtubeId && onYoutubeClick) {
                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => onYoutubeClick(youtubeId)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 hover:border-red-500/40 rounded text-red-400 hover:text-red-300 transition-all text-xs font-semibold cursor-pointer align-middle mx-0.5"
                    >
                        <svg className="w-3 h-3 fill-current mr-0.5 shrink-0" viewBox="0 0 24 24">
                            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span className="underline decoration-red-500/30 underline-offset-2 break-all">{part}</span>
                    </button>
                );
            }

            return (
                <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline break-all font-semibold"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
}

export const editSpotText: Record<string, string> = {
    de: "Spot bearbeiten",
    en: "Edit Spot",
    es: "Editar punto",
    fr: "Modifier le spot",
    it: "Modifica lo spot",
    pt: "Editar o spot",
    nl: "Spot bewerken",
    pl: "Edytuj spot",
    sv: "Redigera spotten"
};

export const commentsHeaderText: Record<string, string> = {
    de: "Kommentare",
    en: "Comments",
    es: "Comentarios",
    fr: "Commentaires",
    it: "Commenti",
    pt: "Comentários",
    nl: "Reacties",
    pl: "Komentarze",
    sv: "Kommentarer"
};

export const commentPlaceholderText: Record<string, string> = {
    de: "Schreibe einen Kommentar oder eine Frage...",
    en: "Write a comment or ask a question...",
    es: "Escribe un comentario o haz una pregunta...",
    fr: "Écris un commentaire ou pose une question...",
    it: "Scrivi un commento o fai una domanda...",
    pt: "Escreve um comentário ou faz uma pergunta...",
    nl: "Schrijf een reactie of stel een vraag...",
    pl: "Napisz komentarz lub zadaj pytanie...",
    sv: "Skriv en kommentar eller ställ en fråga..."
};

export const commentButtonText: Record<string, string> = {
    de: "Kommentieren",
    en: "Comment",
    es: "Comentar",
    fr: "Commenter",
    it: "Commenta",
    pt: "Comentar",
    nl: "Reageren",
    pl: "Skomentuj",
    sv: "Kommentera"
};

export const commentSignInPrompt: Record<string, string> = {
    de: "Bitte logge dich ein, um Kommentare zu hinterlassen.",
    en: "Please sign in to leave comments.",
    es: "Por favor, inicia sesión para dejar comentarios.",
    fr: "Veuillez vous connecter pour laisser des commentaires.",
    it: "Per favore, accedi per lasciare commenti.",
    pt: "Por favor, inicia sessão para deixar comentários.",
    nl: "Log in om reacties achter te laten.",
    pl: "Zaloguj się, aby zostawić komentarz.",
    sv: "Logga in för att lämna kommentarer."
};

export const replyPlaceholderText: Record<string, string> = {
    de: "Antworte auf diesen Kommentar...",
    en: "Reply to this comment...",
    es: "Responde a este comentario...",
    fr: "Répondre à ce commentaire...",
    it: "Rispondi a questo commento...",
    pt: "Responde a este comentário...",
    nl: "Reageer op deze reactie...",
    pl: "Odpowiedz na ten komentarz...",
    sv: "Svara på denna kommentar..."
};

export const replyButtonText: Record<string, string> = {
    de: "Antworten",
    en: "Reply",
    es: "Responder",
    fr: "Répondre",
    it: "Rispondi",
    pt: "Responder",
    nl: "Reageren",
    pl: "Odpowiedz",
    sv: "Svara"
};

export const noCommentsText: Record<string, string> = {
    de: "Noch keine Kommentare oder Fragen zu diesem Spot. Stell das erste Kommentar oder die erste Frage!",
    en: "No comments or questions yet about this spot. Write the first comment or ask the first question!",
    es: "¡Aún no hay comentarios ni preguntas sobre este spot. Escribe el primer comentario o haz la primera pregunta!",
    fr: "Pas encore de commentaires ou de questions sur ce spot. Écris le premier commentaire ou pose la première question !",
    it: "Non ci sono ancora commenti o domande su questo spot. Scrivi il primo commento o fai la prima domanda!",
    pt: "Ainda não há comentários ou perguntas sobre este spot. Escreve o primeiro comentário ou faz a primeira pergunta!",
    nl: "Nog geen reacties of vragen over deze spot. Schrijf de eerste reactie of stel de eerste vraag!",
    pl: "Nie ma jeszcze komentarzy ani pytań o tym spocie. Napisz pierwszy komentarz lub zadaj pierwsze pytanie!",
    sv: "Inga kommentarer eller frågor om denna spot ännu. Skriv den första kommentaren eller ställ den första frågan!"
};

import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { useLanguage, useTranslate } from "@/lib/i18n";
import { verifySpot } from "@/app/actions";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { AuthDialog } from "@/components/AuthDialog";
import { compressImage } from "@/lib/image-utils";

interface SpotDialogProps {
    spot: Spot | null;
    open: boolean;
    onClose: () => void;
    onEdit: () => void;
    onViewProfile?: (profileId: string) => void;
}
interface Review {
    id: string;
    user_id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles?: {
        username: string | null;
        avatar_url: string | null;
        bio: string | null;
    };
}

interface SpotVisit {
    id: string;
    spot_id: string;
    user_id: string;
    visit_date: string;
    visit_time: string;
    description: string;
    created_at: string;
    profiles?: {
        username: string | null;
        avatar_url: string | null;
    } | null;
    visit_comments?: {
        id: string;
        visit_id: string;
        user_id: string;
        comment: string;
        created_at: string;
        profiles?: {
            username: string | null;
            avatar_url: string | null;
        } | null;
    }[];
    visit_participants?: {
        id: string;
        visit_id: string;
        user_id: string;
        status: 'JOINED' | 'CANCELLED';
        profiles?: {
            username: string | null;
            avatar_url: string | null;
        } | null;
    }[];
}


export function SpotDialog({ spot, open, onClose, onEdit, onViewProfile }: SpotDialogProps) {
    const [verifying, setVerifying] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState("");
    const [uploading, setUploading] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [hasExistingReview, setHasExistingReview] = useState(false);
    const [creatorUsername, setCreatorUsername] = useState<string | null>(null);
    const [creatorId, setCreatorId] = useState<string | null>(null);

    // Likes & Bookmarks states
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);

    // Spot Visit Planning & Comments states
    const [visits, setVisits] = useState<SpotVisit[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
    const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
    const [showPlanning, setShowPlanning] = useState(false);
    const [migrationError, setMigrationError] = useState(false);
    
    // Visit creation form states
    const [visitTime, setVisitTime] = useState("10:00");
    const [visitDesc, setVisitDesc] = useState("");
    const [submittingVisit, setSubmittingVisit] = useState(false);
    
    // Comment reply states
    const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
    const [submittingReply, setSubmittingReply] = useState<{ [key: string]: boolean }>({});
    const [editingVisitCommentId, setEditingVisitCommentId] = useState<string | null>(null);
    const [editingVisitCommentText, setEditingVisitCommentText] = useState("");
    const [isDeletingReview, setIsDeletingReview] = useState(false);

    // Spot Q&A states
    const [questions, setQuestions] = useState<SpotQuestion[]>([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [submittingQuestion, setSubmittingQuestion] = useState(false);
    const [activeReplyBoxId, setActiveReplyBoxId] = useState<string | null>(null);
    const [newAnswerText, setNewAnswerText] = useState("");
    const [submittingAnswer, setSubmittingAnswer] = useState(false);

    const searchParams = useSearchParams();

    const { user, profile } = useAuth();
    const isAdmin = user?.email === 'callematic@gmail.com';
    const isSpotCreator = !!(user && spot && (spot.user_id === user.id || spot.created_by === user.id || isAdmin));
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
    const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
    const { showToast } = useToast();
    const { t, locale } = useLanguage();
    const { translatedText: translatedDescription, isTranslated: isDescriptionTranslated } = useTranslate(spot?.attributes?.description, locale);
    const { translatedText: translatedName, isTranslated: isNameTranslated } = useTranslate(spot?.name, locale);

    // Reset state when opening a new spot
    useEffect(() => {
        if (open && spot) {
            const timer = setTimeout(() => {
                setRating(0);
                setComment("");
                setVerifying(false);
                setUploading(false);
                setPhotos([]); // Clear first so we don't show old photos
                setReviews([]);
                setHasExistingReview(false);
                setCreatorUsername(null);
                
                // Reset scheduling states
                setVisits([]);
                setMigrationError(false);
                setVisitDesc("");
                setVisitTime("10:00");
                setReplyText({});
                setSubmittingReply({});
                setShowPlanning(false);
            }, 0);
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, spot?.id]); // Reset only on spot change or when opened

    const loadVisitsData = useCallback(async () => {
        if (!spot) return;
        setMigrationError(false);
        const todayStr = new Date().toISOString().split('T')[0];
        try {
            const { data, error } = await supabase
                .from('spot_visits')
                .select(`
                    id, spot_id, user_id, visit_date, visit_time, description, created_at,
                    profiles(username, avatar_url),
                    visit_comments(
                        id, visit_id, user_id, comment, created_at,
                        profiles(username, avatar_url)
                    ),
                    visit_participants(
                        id, visit_id, user_id, status,
                        profiles(username, avatar_url)
                    )
                `)
                .eq('spot_id', spot.id)
                .gte('visit_date', todayStr)
                .order('visit_date', { ascending: true });
                
            if (error) {
                console.error("Error loading visits:", error);
                if (error.message.includes("relation") || error.message.includes("spot_visits") || error.code === "42P01") {
                    setMigrationError(true);
                }
            } else {
                const fetchedVisits = (data as unknown as SpotVisit[]) || [];
                setVisits(fetchedVisits);
                
                // UX Auto-select: Auto-select the closest upcoming visit if one exists (and no deep-link is active)
                const deepVisitId = searchParams.get('visit');
                if (!deepVisitId && fetchedVisits.length > 0) {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const upcomingVisit = fetchedVisits.find(v => v.visit_date >= todayStr);
                    const targetVisit = upcomingVisit || fetchedVisits[fetchedVisits.length - 1];
                    if (targetVisit) {
                        setSelectedDate(targetVisit.visit_date);
                        setCurrentMonth(new Date(targetVisit.visit_date));
                    }
                }
            }
        } catch (err) {
            console.error("Exception loading visits:", err);
            setMigrationError(true);
        }
    }, [spot, searchParams]);

    // Deep Linking to specific visits
    useEffect(() => {
        if (open && spot) {
            const deepVisitId = searchParams.get('visit');
            const tab = searchParams.get('tab');
            if (deepVisitId || tab === 'visits') {
                setShowPlanning(true);
                if (deepVisitId) {
                    supabase
                        .from('spot_visits')
                        .select('visit_date')
                        .eq('id', deepVisitId)
                        .single()
                        .then(({ data }) => {
                            if (data?.visit_date) {
                                setSelectedDate(data.visit_date);
                                setCurrentMonth(new Date(data.visit_date));
                            }
                        });
                }
            }
        }
    }, [open, spot, searchParams]);

    // Load visits on open/change
    useEffect(() => {
        if (open && spot) {
            loadVisitsData();
        }
    }, [open, spot, loadVisitsData]);

    // Custom calendar helper functions
    const getDaysInMonth = (y: number, m: number) => {
        return new Date(y, m + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (y: number, m: number) => {
        const day = new Date(y, m, 1).getDay();
        return day === 0 ? 6 : day - 1; // Mon is 0, Sun is 6
    };

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);
    
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const offsetArray = Array.from({ length: firstDayIndex }, (_, i) => i);
    
    const handlePrevMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };
    
    const handleNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const handleCreateVisit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        if (!visitDesc.trim()) {
            showToast(locale === 'de' ? 'Beschreibung fehlt!' : 'Description missing!', 'error');
            return;
        }
        setSubmittingVisit(true);
        try {
            const res = await createSpotVisit({
                spot_id: spot!.id,
                visit_date: selectedDate,
                visit_time: visitTime,
                description: visitDesc
            });
            if (res.success) {
                showToast(locale === 'de' ? 'Termin erfolgreich geplant! 🚀' : 'Visit scheduled successfully! 🚀', 'success');
                setVisitDesc("");
                loadVisitsData();
                window.dispatchEvent(new Event('reload-spots'));
            } else {
                showToast(res.error || 'Error scheduling visit', 'error');
            }
        } catch (err) {
            console.error("Create visit error:", err);
        } finally {
            setSubmittingVisit(false);
        }
    };

    const handlePostReply = async (visitId: string) => {
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        const text = replyText[visitId] || "";
        if (!text.trim()) return;
        
        setSubmittingReply(prev => ({ ...prev, [visitId]: true }));
        try {
            const res = await addVisitComment({
                visit_id: visitId,
                comment: text
            });
            if (res.success) {
                showToast(locale === 'de' ? 'Kommentar gepostet!' : 'Comment posted!', 'success');
                setReplyText(prev => ({ ...prev, [visitId]: "" }));
                loadVisitsData();
            } else {
                showToast(res.error || 'Error posting comment', 'error');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmittingReply(prev => ({ ...prev, [visitId]: false }));
        }
    };

    const handleUpdateVisitComment = async (commentId: string, visitId: string) => {
        if (!user || !editingVisitCommentText.trim()) return;
        try {
            const res = await updateVisitComment(commentId, editingVisitCommentText);
            if (res.success) {
                setVisits(prev => prev.map(v => 
                    v.id === visitId 
                        ? { 
                            ...v, 
                            visit_comments: v.visit_comments?.map(c => c.id === commentId ? { ...c, comment: editingVisitCommentText } : c)
                        }
                        : v
                ));
                setEditingVisitCommentId(null);
                setEditingVisitCommentText("");
                showToast("Kommentar aktualisiert!");
            } else {
                showToast("Fehler beim Aktualisieren.", "error");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteVisitComment = async (commentId: string, visitId: string) => {
        if (!user) return;
        if (!window.confirm("Kommentar wirklich löschen?")) return;
        try {
            const res = await deleteVisitComment(commentId);
            if (res.success) {
                setVisits(prev => prev.map(v => 
                    v.id === visitId 
                        ? { 
                            ...v, 
                            visit_comments: v.visit_comments?.filter(c => c.id !== commentId)
                        }
                        : v
                ));
                showToast("Kommentar gelöscht.");
            } else {
                showToast("Fehler beim Löschen.", "error");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleJoinOrCancel = async (visitId: string, currentStatus: 'JOINED' | 'CANCELLED' | null) => {
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        
        const newStatus = currentStatus === 'JOINED' ? 'CANCELLED' : 'JOINED';
        try {
            const res = await joinOrCancelVisit(visitId, newStatus);
            if (res.success) {
                showToast(
                    locale === 'de' 
                        ? (newStatus === 'JOINED' ? 'Zusage erfolgreich! 🤝' : 'Absage erfolgreich! 👋') 
                        : (newStatus === 'JOINED' ? 'Successfully joined! 🤝' : 'Successfully cancelled! 👋'),
                    'success'
                );
                loadVisitsData();
            } else {
                showToast(res.error || 'Error updating status', 'error');
            }
        } catch (err) {
            console.error("Join/Cancel error:", err);
        }
    };

    const handleDeleteVisitClick = async (visit: SpotVisit) => {
        if (!user || user.id !== visit.user_id) return;
        
        const otherReacted = 
            visit.visit_participants && 
            visit.visit_participants.some(p => p.user_id !== user.id && p.status === 'JOINED');
            
        if (otherReacted) {
            try {
                const res = await joinOrCancelVisit(visit.id, 'CANCELLED');
                if (res.success) {
                    showToast(
                        locale === 'de' 
                            ? 'Du hast abgesagt. Da andere bereits zugesagt haben, bleibt der Termin bestehen.' 
                            : 'You have cancelled. Since others have joined, the visit remains.',
                        'success'
                    );
                    loadVisitsData();
                }
            } catch (err) {
                console.error("Cancel creator visit error:", err);
            }
        } else {
            const confirmMsg = locale === 'de'
                ? 'Möchtest du diesen Termin wirklich löschen? Da niemand sonst reagiert hat, wird er komplett entfernt.'
                : 'Do you really want to delete this visit? Since no one else reacted, it will be completely removed.';
                
            if (window.confirm(confirmMsg)) {
                try {
                    const res = await deleteSpotVisit(visit.id);
                    if (res.success) {
                        showToast(locale === 'de' ? 'Termin gelöscht!' : 'Visit deleted!', 'success');
                        loadVisitsData();
                        window.dispatchEvent(new Event('reload-spots'));
                    } else {
                        showToast(res.error || 'Error deleting visit', 'error');
                    }
                } catch (err) {
                    console.error("Delete visit error:", err);
                }
            }
        }
    };
    
    // Fetch likes and bookmark status when opening
    useEffect(() => {
        if (open && spot) {
            getSpotLikesCount(spot.id).then(setLikesCount);
            if (user) {
                getSpotLikeStatus(spot.id).then(setIsLiked);
                supabase.from('spot_bookmarks')
                    .select('id')
                    .eq('spot_id', spot.id)
                    .eq('user_id', user.id)
                    .maybeSingle()
                    .then(({ data }) => {
                        setIsBookmarked(!!data);
                    });
            } else {
                setIsLiked(false);
                setIsBookmarked(false);
            }
        }
    }, [open, spot, user]);

    const handleLikeToggle = async () => {
        if (!spot) return;
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        setLikeLoading(true);
        try {
            const res = await toggleLikeSpot(spot.id);
            if (res.success) {
                setIsLiked(res.action === 'liked');
                setLikesCount(prev => res.action === 'liked' ? prev + 1 : prev - 1);
                showToast(res.action === 'liked' ? (locale === 'de' ? 'Gefällt mir!' : 'Liked!') : (locale === 'de' ? 'Gefällt mir nicht mehr' : 'Unliked'), 'success');
            } else {
                showToast(res.error || 'Error liking spot', 'error');
            }
        } catch (err) {
            console.error("Toggle like error:", err);
        } finally {
            setLikeLoading(false);
        }
    };

    const handleBookmarkToggle = async () => {
        if (!spot) return;
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        setBookmarkLoading(true);
        try {
            const res = await toggleBookmarkSpot(spot.id);
            if (res.success) {
                setIsBookmarked(res.action === 'bookmarked');
                showToast(res.action === 'bookmarked' ? (locale === 'de' ? 'Spot gemerkt!' : 'Spot saved!') : (locale === 'de' ? 'Spot-Merkung entfernt' : 'Spot removed from saved'), 'success');
                window.dispatchEvent(new Event('reload-bookmarks'));
            } else {
                showToast(res.error || 'Error saving spot', 'error');
            }
        } catch (err) {
            console.error("Toggle bookmark error:", err);
        } finally {
            setBookmarkLoading(false);
        }
    };

    // Fetch photos and reviews on open
    useEffect(() => {
        if (open && spot) {
            getSpotQuestionsAndAnswers(spot.id).then((res) => {
                setQuestions(res);
            });

            supabase.from('spot_photos')
                .select('url')
                .eq('spot_id', spot.id)
                .order('created_at', { ascending: false })
                .then(({ data, error }) => {
                    if (error) {
                        console.error("Fetch Photos Error:", error);
                    }
                    if (data) setPhotos(data.map(d => d.url));
                });

            supabase.from('spots')
                .select('user_id, created_by, profiles(username)')
                .eq('id', spot.id)
                .maybeSingle()
                .then(({ data }) => {
                    if (data) {
                        const spotData = data as unknown as { user_id: string | null; created_by: string | null; profiles: { username: string | null } | { username: string | null }[] | null };
                        const p = spotData.profiles;
                        const profilesObj = Array.isArray(p) ? p[0] : p;
                        setCreatorId(spotData.created_by || spotData.user_id);
                        if (profilesObj?.username) {
                            setCreatorUsername(profilesObj.username);
                        } else if (spotData.user_id || spotData.created_by) {
                            setCreatorUsername('eFoiler');
                        } else {
                            setCreatorUsername('eFoilMap');
                        }
                    } else {
                        setCreatorUsername('eFoilMap');
                        setCreatorId(null);
                    }
                });

            supabase.from('spot_verifications')
                .select('id, user_id, rating, comment, created_at, profiles(username, avatar_url, bio)')
                .eq('spot_id', spot.id)
                .order('created_at', { ascending: false })
                .then(({ data }) => {
                    if (data) {
                        const userReview = data.find(d => user && d.user_id === user.id);

                        const mapped: Review[] = data
                            .filter(d => {
                                if (user && d.user_id === user.id) {
                                    return false; // Hide own review from community list
                                }
                                // Only show community reviews that have a comment
                                return d.comment && d.comment.trim() !== "";
                            })
                            .map((d) => ({
                                id: d.id,
                                user_id: d.user_id,
                                rating: d.rating,
                                comment: d.comment,
                                created_at: d.created_at,
                                profiles: Array.isArray(d.profiles) ? d.profiles[0] : (d.profiles as Review['profiles'])
                            }));

                        if (userReview) {
                            setRating(userReview.rating || 0);
                            setComment(userReview.comment || "");
                            setHasExistingReview(true);
                        }

                        setReviews(mapped);
                    }
                });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, spot?.id, user?.id]);

    const handleQuestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !spot || !newQuestion.trim()) return;
        setSubmittingQuestion(true);
        try {
            const res = await createSpotQuestion(spot.id, newQuestion.trim());
            if (res.success) {
                const updated = await getSpotQuestionsAndAnswers(spot.id);
                setQuestions(updated);
                setNewQuestion("");
                showToast(locale === 'de' ? "Frage erfolgreich gepostet!" : "Question posted successfully!");
            } else {
                showToast(locale === 'de' ? "Fehler: " + res.error : "Error: " + res.error, "error");
            }
        } catch (err: any) {
            console.error(err);
            showToast(locale === 'de' ? "Fehler beim Posten der Frage." : "Error posting question.", "error");
        } finally {
            setSubmittingQuestion(false);
        }
    };

    const handleAnswerSubmit = async (e: React.FormEvent, questionId: string) => {
        e.preventDefault();
        if (!user || !spot || !newAnswerText.trim()) return;
        setSubmittingAnswer(true);
        try {
            const res = await createSpotAnswer(questionId, newAnswerText.trim());
            if (res.success) {
                const updated = await getSpotQuestionsAndAnswers(spot.id);
                setQuestions(updated);
                setNewAnswerText("");
                setActiveReplyBoxId(null);
                showToast(locale === 'de' ? "Antwort erfolgreich gepostet!" : "Reply posted successfully!");
            } else {
                showToast(locale === 'de' ? "Fehler: " + res.error : "Error: " + res.error, "error");
            }
        } catch (err: any) {
            console.error(err);
            showToast(locale === 'de' ? "Fehler beim Posten der Antwort." : "Error posting reply.", "error");
        } finally {
            setSubmittingAnswer(false);
        }
    };

    if (!open || !spot) return null;

    const handleVerify = async () => {
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        if (rating === 0) {
            showToast("Please provide a star rating to confirm.", "error");
            return;
        }

        setVerifying(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await verifySpot(spot.id, rating, comment, session?.access_token);
            if (res.success) {
                showToast("Spot confirmed! Thank you.");

                // Optimistic UI Update for Review
                if (comment) {
                    setReviews(prev => [{
                        id: 'temp-' + Date.now(),
                        user_id: user.id,
                        rating,
                        comment,
                        created_at: new Date().toISOString(),
                        profiles: {
                            username: profile?.username || user?.email?.split('@')[0] || "User",
                            avatar_url: profile?.avatar_url || null,
                            bio: profile?.bio || null
                        }
                    }, ...prev]);
                }

                // Clear input
                setRating(0);
                setComment("");

                // Do NOT close dialog, let user see it added? No, usually we close or show success state.
                // User said "Confirm Spot doesn't add review". So we should show it.
                // onClose(); 
            } else {
                showToast("Verification failed: " + res.error, "error");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setVerifying(false);
        }
    };

    const handleDeleteReview = async () => {
        if (!user || !spot) return;
        if (!window.confirm("Bewertung wirklich löschen?")) return;
        setIsDeletingReview(true);
        try {
            const { data } = await supabase
                .from('spot_verifications')
                .select('id')
                .eq('spot_id', spot.id)
                .eq('user_id', user.id)
                .single();
            
            if (data?.id) {
                const res = await deleteSpotReview(data.id);
                if (res.success) {
                    setHasExistingReview(false);
                    setRating(0);
                    setComment("");
                    showToast("Bewertung gelöscht.");
                } else {
                    showToast("Fehler beim Löschen.", "error");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeletingReview(false);
        }
    };

    const handleAdminDeleteReview = async (reviewId: string) => {
        if (!window.confirm("Admin: Bewertung löschen?")) return;
        try {
            const res = await deleteSpotReview(reviewId);
            if (res.success) {
                setReviews(prev => prev.filter(r => r.id !== reviewId));
                showToast("Admin: Bewertung gelöscht.");
            } else {
                showToast("Fehler beim Löschen.", "error");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Compress Image (Spots use default 1200px)
            const compressedBlob = await compressImage(file);
            const fileName = `${spot.id}/${Date.now()}-${file.name.split('.')[0]}.webp`;
            const { error } = await supabase.storage
                .from('spots')
                .upload(fileName, compressedBlob, {
                    contentType: 'image/webp',
                    upsert: true
                });

            if (error) {
                showToast("Upload failed: " + error.message, "error");
            } else {

                // Add reference to spot_photos table
                const publicUrl = supabase.storage.from('spots').getPublicUrl(fileName).data.publicUrl;

                const { error: insertError } = await supabase.from('spot_photos').insert({
                    spot_id: spot.id,
                    url: publicUrl
                });

                if (insertError) {
                    console.error("Database Insert Error (spot_photos):", insertError);
                    showToast("Database error: " + insertError.message, "error");
                } else {
                    // Optimistic update
                    setPhotos(prev => [publicUrl, ...prev]);
                    showToast("Photo uploaded successfully!");
                }
            }
        } catch {
            showToast("Upload error.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleShare = () => {
        const baseUrl = `${window.location.origin}${window.location.pathname}`;
        const params = new URLSearchParams(window.location.search);
        params.set('lang', locale);
        const shareUrl = `${baseUrl}?${params.toString()}`;
        navigator.clipboard.writeText(shareUrl);
        showToast(t('common.link_copied') || "Link copied to clipboard!");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full sm:max-w-md bg-card border-x border-t sm:border border-border rounded-t-2xl sm:rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 sm:fade-in max-h-[92dvh] sm:max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="p-4 border-b flex flex-col gap-3 bg-muted/30">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                            <h2 className="text-xl font-bold tracking-tight leading-tight">{spot.name}</h2>
                            {isNameTranslated && (
                                <p className="text-xs font-semibold text-muted-foreground/80 mt-0.5 italic">
                                    {translatedName}
                                </p>
                            )}
                            {/* AI Translation Badge */}
                            {spot.source_locale && spot.source_locale !== locale && (
                                <p className="text-[10px] text-muted-foreground italic mt-0.5">
                                    {t('ugc.ai_translated')}
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                {/* Status and Rating Row */}
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border whitespace-nowrap",
                                    spot.status === "ALLOWED" && "bg-green-500/10 text-green-500 border-green-500/20",
                                    spot.status === "TOLERATED" && "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
                                    spot.status === "FORBIDDEN" && "bg-red-500/10 text-red-500 border-red-500/20",
                                    spot.status === "UNCLEAR" && "bg-gray-500/10 text-gray-400 border-gray-500/20"
                                )}>
                                    {spot.status === "ALLOWED" ? t('forms.allowed') :
                                        spot.status === "TOLERATED" ? t('forms.tolerated') :
                                            spot.status === "FORBIDDEN" ? t('forms.forbidden') : t('forms.unclear')}
                                </span>
                                {spot.average_rating ? (
                                    <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold">
                                        <Star className="w-3 h-3 fill-current" />
                                        {spot.average_rating.toFixed(1)} <span className="text-muted-foreground font-normal">({spot.rating_count})</span>
                                    </div>
                                ) : null}
                            </div>
                            {creatorUsername && (
                                <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                                    <span>{addedByText[locale] || addedByText.en}:</span>
                                    {creatorId ? (
                                        <button 
                                            onClick={() => onViewProfile?.(creatorId)}
                                            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors border-none bg-transparent p-0 cursor-pointer focus:outline-none text-[10px] hover:underline"
                                        >
                                            @{creatorUsername}
                                        </button>
                                    ) : (
                                        <span className="font-semibold text-foreground">@{creatorUsername}</span>
                                    )}
                                </p>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="p-1 -mr-1 rounded-full hover:bg-muted transition-colors shrink-0"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-3 pt-1">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50 px-2 py-1.5 rounded-md"
                            title="Share this spot"
                        >
                            <Share2 className="w-3.5 h-3.5" />
                            {t('common.share') || "Share"}
                        </button>

                        {/* Like Button */}
                        <button
                            onClick={handleLikeToggle}
                            disabled={likeLoading}
                            className={cn(
                                "flex items-center gap-1.5 text-xs transition-colors hover:bg-muted/50 px-2 py-1.5 rounded-md cursor-pointer",
                                isLiked ? "text-red-500 hover:text-red-400 font-bold" : "text-muted-foreground hover:text-red-500"
                            )}
                            title={isLiked ? "Unlike spot" : "Like spot"}
                        >
                            <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-current")} />
                            <span>{likesCount}</span>
                        </button>

                        {/* Bookmark Button */}
                        <button
                            onClick={handleBookmarkToggle}
                            disabled={bookmarkLoading}
                            className={cn(
                                "flex items-center gap-1.5 text-xs transition-colors hover:bg-muted/50 px-2 py-1.5 rounded-md cursor-pointer",
                                isBookmarked ? "text-yellow-500 hover:text-yellow-400" : "text-muted-foreground hover:text-yellow-500"
                            )}
                            title={isBookmarked ? "Remove bookmark" : "Bookmark spot"}
                        >
                            <Bookmark className={cn("w-3.5 h-3.5", isBookmarked && "fill-current")} />
                        </button>

                        {spot.attributes?.website && (
                            <a
                                href={spot.attributes.website.startsWith('http') ? spot.attributes.website : `https://${spot.attributes.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors hover:bg-muted/50 px-2 py-1.5 rounded-md cursor-pointer"
                                title="Visit website"
                            >
                                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                    {t('forms.website')}
                                </span>
                            </a>
                        )}

                        <button
                            onClick={() => {
                                if (!showPlanning && !user) {
                                    setIsAuthOpen(true);
                                    return;
                                }
                                setShowPlanning(!showPlanning);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 rounded-full text-xs font-bold text-blue-400 transition-all active:scale-95 ml-auto"
                        >
                            {showPlanning ? (
                                <>
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>{locale === 'de' ? 'Details ℹ️' : 'Details ℹ️'}</span>
                                </>
                            ) : (
                                <>
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{locale === 'de' ? 'Termine 📅' : 'Visits 📅'}</span>
                                </>
                            )}
                        </button>

                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {showPlanning ? (
                        <div className="space-y-6">
                            {migrationError ? (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-400">
                                    <h4 className="font-bold mb-1">
                                        {locale === 'de' ? '⚠️ SQL-Migration erforderlich' : '⚠️ SQL Migration Required'}
                                    </h4>
                                    <p className="text-xs text-red-300/80 leading-relaxed">
                                        {locale === 'de' 
                                            ? 'Bitte kopiere den SQL-Code aus "supabase/migrations/20260525000000_visit_planning.sql" und führe ihn in deinem Supabase SQL-Editor aus, um die Tabellen für Verabredungen und Kommentare anzulegen!' 
                                            : 'Please copy the SQL code from "supabase/migrations/20260525000000_visit_planning.sql" and run it in your Supabase SQL Editor to create the tables for visits and comments!'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Calendar Section */}
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-blue-400" />
                                                {locale === 'de' 
                                                    ? `${monthNames.de[month]} ${year}` 
                                                    : `${monthNames.en[month]} ${year}`}
                                            </h3>
                                            <div className="flex items-center gap-1">
                                                <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer">
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Weekdays */}
                                        <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                            {(weekdays[locale] || weekdays.en).map(day => (
                                                <span key={day} className="text-[10px] uppercase font-black text-gray-500">{day}</span>
                                            ))}
                                        </div>

                                        {/* Days Grid */}
                                        <div className="grid grid-cols-7 gap-1">
                                            {/* Offset elements */}
                                            {offsetArray.map(i => (
                                                <div key={`offset-${i}`} className="aspect-square" />
                                            ))}

                                            {/* Actual days */}
                                            {daysArray.map(day => {
                                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                const isSelected = dateStr === selectedDate;
                                                const hasVisit = visits.some(v => v.visit_date === dateStr);
                                                
                                                const todayStr = new Date().toISOString().split('T')[0];
                                                const isPast = dateStr < todayStr;
                                                
                                                return (
                                                    <button
                                                        key={`day-${day}`}
                                                        disabled={isPast}
                                                        onClick={() => setSelectedDate(dateStr)}
                                                        className={cn(
                                                            "aspect-square rounded-xl flex flex-col items-center justify-center relative text-xs font-bold transition-all border",
                                                            isPast 
                                                                ? "opacity-20 cursor-not-allowed text-gray-600 border-transparent bg-transparent" 
                                                                : "hover:scale-105 active:scale-95 cursor-pointer",
                                                            isSelected && !isPast
                                                                ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20" 
                                                                : !isPast ? "bg-white/5 border-transparent text-gray-300 hover:bg-white/10" : "",
                                                            hasVisit && !isSelected && !isPast && "border-blue-400/40 font-black text-blue-400"
                                                        )}
                                                    >
                                                        <span>{day}</span>
                                                        {hasVisit && !isPast && (
                                                            <span className={cn(
                                                                "absolute bottom-1 w-1 h-1 rounded-full",
                                                                isSelected ? "bg-white" : "bg-blue-400 animate-pulse"
                                                            )} />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Visits on Selected Day */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            {locale === 'de' ? `Pläne für den ${new Date(selectedDate).toLocaleDateString('de-DE')}` : `Plans for ${new Date(selectedDate).toLocaleDateString('en-US')}`}
                                        </h3>

                                        {(() => {
                                            const dayVisits = visits.filter(v => v.visit_date === selectedDate);
                                            if (dayVisits.length === 0) {
                                                return (
                                                    <div className="text-xs text-muted-foreground italic p-4 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                                                        {locale === 'de' 
                                                            ? 'Keine Termine für diesen Tag geplant. Plane jetzt eine neue Verabredung unten!' 
                                                            : 'No plans for this day yet. Schedule a new visit below!'}
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div className="space-y-4">
                                                    {dayVisits.map((visit) => {
                                                        const activeVisitId = searchParams.get('visit');
                                                        const isHighlighted = visit.id === activeVisitId;
                                                        
                                                        const isCreator = user && user.id === visit.user_id;
                                                        const myParticipant = visit.visit_participants?.find(p => user && p.user_id === user.id);
                                                        const isJoined = myParticipant ? myParticipant.status === 'JOINED' : isCreator; // creator is joined by default
                                                        const participants = visit.visit_participants || [];
                                                        
                                                        return (
                                                            <div 
                                                                key={visit.id} 
                                                                className={cn(
                                                                    "bg-white/5 border rounded-2xl p-4 space-y-4 transition-all",
                                                                    isHighlighted ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20" : "border-white/10"
                                                                )}
                                                            >
                                                                {/* Visit Header */}
                                                                <div className="flex items-center gap-3">
                                                                    <button 
                                                                        onClick={() => onViewProfile?.(visit.user_id)}
                                                                        className="w-8 h-8 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-gray-300 overflow-hidden relative shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all block focus:outline-none"
                                                                    >
                                                                        {visit.profiles?.avatar_url ? (
                                                                            <Image src={visit.profiles.avatar_url} alt="Avatar" fill className="object-cover" />
                                                                        ) : (
                                                                            <UserIcon className="w-4 h-4" />
                                                                        )}
                                                                    </button>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <button 
                                                                                onClick={() => onViewProfile?.(visit.user_id)}
                                                                                className="text-xs font-black text-white hover:text-blue-400 hover:underline transition-colors border-none bg-transparent p-0 cursor-pointer text-left focus:outline-none"
                                                                            >
                                                                                @{visit.profiles?.username || 'User'}
                                                                            </button>
                                                                            <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-400/20 font-black">
                                                                                ⏰ {visit.visit_time.substring(0, 5)}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-[10px] text-gray-500">{new Date(visit.created_at).toLocaleDateString()}</p>
                                                                    </div>

                                                                    {/* Action Button: Zusagen / Absagen / Löschen */}
                                                                    {user && (
                                                                        <button
                                                                            onClick={() => {
                                                                                if (isCreator) {
                                                                                    if (isJoined) {
                                                                                        handleDeleteVisitClick(visit);
                                                                                    } else {
                                                                                        handleJoinOrCancel(visit.id, 'CANCELLED');
                                                                                    }
                                                                                } else {
                                                                                    handleJoinOrCancel(visit.id, myParticipant?.status || null);
                                                                                }
                                                                            }}
                                                                            className={cn(
                                                                                "px-3 py-1.5 rounded-xl text-[10px] font-black border transition-all active:scale-95 cursor-pointer shrink-0",
                                                                                isJoined
                                                                                    ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                                                                                    : "bg-blue-600 border-blue-500 text-white hover:bg-blue-500 shadow-md shadow-blue-500/10"
                                                                            )}
                                                                        >
                                                                            {isJoined
                                                                                ? isCreator
                                                                                    ? (locale === 'de' ? 'Termin Absagen ❌' : 'Cancel Visit ❌')
                                                                                    : (locale === 'de' ? 'Absagen 👋' : 'Cancel 👋')
                                                                                : (locale === 'de' ? 'Zusagen 🤝' : 'Join 🤝')}
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                {/* Event Comment */}
                                                                <p className="text-sm text-foreground bg-white/5 p-3 rounded-xl italic border border-white/5">
                                                                    &ldquo;{visit.description}&rdquo;
                                                                </p>

                                                                {/* Participants list */}
                                                                <div className="flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-3">
                                                                    <span className="text-[10px] uppercase font-black text-gray-500 tracking-wider">
                                                                        {locale === 'de' ? 'Teilnehmer:' : 'Riders:'}
                                                                    </span>
                                                                    {participants.length === 0 ? (
                                                                        <span className="text-gray-400 italic text-[11px]">
                                                                            @{visit.profiles?.username || 'User'}
                                                                        </span>
                                                                    ) : (
                                                                        participants.map((p) => {
                                                                            const isCancelled = p.status === 'CANCELLED';
                                                                            return (
                                                                                <button 
                                                                                    key={p.id} 
                                                                                    onClick={() => onViewProfile?.(p.user_id)}
                                                                                    className={cn(
                                                                                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 cursor-pointer hover:bg-blue-500/20 transition-colors focus:outline-none",
                                                                                        isCancelled 
                                                                                            ? "bg-red-500/5 border-red-500/10 text-gray-500 line-through hover:bg-red-500/10" 
                                                                                            : "bg-blue-500/10 border-blue-500/20 text-blue-300"
                                                                                    )}
                                                                                >
                                                                                    @{p.profiles?.username || 'User'} {isCancelled && (locale === 'de' ? '(Abgesagt)' : '(Cancelled)')}
                                                                                </button>
                                                                            );
                                                                        })
                                                                    )}
                                                                </div>

                                                                {/* Discussion Section */}
                                                                <div className="space-y-3 pt-2 border-t border-white/5">
                                                                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                                                        <MessageSquare className="w-3 h-3" />
                                                                        {locale === 'de' ? 'Absprachen & Kommentare' : 'Social & Comments'}
                                                                    </h4>

                                                                    {/* Comments List */}
                                                                    {visit.visit_comments && visit.visit_comments.length > 0 ? (
                                                                        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                                                                            {visit.visit_comments.map((comm) => {
                                                                                const commenterParticipant = visit.visit_participants?.find(p => p.user_id === comm.user_id);
                                                                                const isCommenterCancelled = commenterParticipant?.status === 'CANCELLED';
                                                                                
                                                                                return (
                                                                                    <div 
                                                                                        key={comm.id} 
                                                                                        className={cn(
                                                                                            "flex gap-2 text-xs bg-white/5 p-2.5 rounded-xl border border-white/5 transition-opacity duration-200 group relative",
                                                                                            isCommenterCancelled && "opacity-35 bg-black/10 border-red-500/5"
                                                                                        )}
                                                                                    >
                                                                                        <button 
                                                                                            onClick={() => onViewProfile?.(comm.user_id)}
                                                                                            className="w-6 h-6 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-gray-400 overflow-hidden relative shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all block focus:outline-none"
                                                                                        >
                                                                                            {comm.profiles?.avatar_url ? (
                                                                                                <Image src={comm.profiles.avatar_url} alt="Avatar" fill className="object-cover" />
                                                                                            ) : (
                                                                                                <UserIcon className="w-3 h-3" />
                                                                                            )}
                                                                                        </button>
                                                                                        <div className="flex-1 min-w-0">
                                                                                            <div className="flex items-center justify-between gap-2">
                                                                                                <button 
                                                                                                    onClick={() => onViewProfile?.(comm.user_id)}
                                                                                                    className="font-bold text-gray-300 hover:text-blue-400 hover:underline transition-colors border-none bg-transparent p-0 cursor-pointer text-left focus:outline-none text-xs"
                                                                                                >
                                                                                                    @{comm.profiles?.username || 'User'}
                                                                                                </button>
                                                                                                {isCommenterCancelled && (
                                                                                                    <span className="text-[9px] font-extrabold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-400/20 ml-1.5 not-italic inline-block">
                                                                                                        {locale === 'de' ? 'Abgesagt' : 'Cancelled'}
                                                                                                    </span>
                                                                                                )}
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <span className="text-[9px] text-gray-500">{new Date(comm.created_at).toLocaleDateString()}</span>
                                                                                                    {/* Edit / Delete Buttons */}
                                                                                                    {user && (user.id === comm.user_id || isAdmin) && (
                                                                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                                                                                            {user.id === comm.user_id && (
                                                                                                                <button
                                                                                                                    onClick={() => {
                                                                                                                        setEditingVisitCommentId(comm.id);
                                                                                                                        setEditingVisitCommentText(comm.comment);
                                                                                                                    }}
                                                                                                                    className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-blue-400 transition-colors"
                                                                                                                    title={locale === 'de' ? 'Bearbeiten' : 'Edit'}
                                                                                                                >
                                                                                                                    <Edit2 className="w-3 h-3" />
                                                                                                                </button>
                                                                                                            )}
                                                                                                            <button
                                                                                                                onClick={() => handleDeleteVisitComment(comm.id, visit.id)}
                                                                                                                className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-red-400 transition-colors"
                                                                                                                title={locale === 'de' ? 'Löschen' : 'Delete'}
                                                                                                            >
                                                                                                                <Trash2 className="w-3 h-3" />
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                            {editingVisitCommentId === comm.id ? (
                                                                                                <div className="mt-2 flex items-center gap-2">
                                                                                                    <input 
                                                                                                        type="text"
                                                                                                        value={editingVisitCommentText}
                                                                                                        onChange={(e) => setEditingVisitCommentText(e.target.value)}
                                                                                                        className="flex-1 bg-black/20 border border-white/10 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                                                        onKeyDown={(e) => {
                                                                                                            if (e.key === 'Enter') handleUpdateVisitComment(comm.id, visit.id);
                                                                                                            if (e.key === 'Escape') setEditingVisitCommentId(null);
                                                                                                        }}
                                                                                                    />
                                                                                                    <button
                                                                                                        onClick={() => handleUpdateVisitComment(comm.id, visit.id)}
                                                                                                        className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
                                                                                                    >
                                                                                                        <Check className="w-3 h-3" />
                                                                                                    </button>
                                                                                                    <button
                                                                                                        onClick={() => setEditingVisitCommentId(null)}
                                                                                                        className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                                                                                                    >
                                                                                                        <X className="w-3 h-3" />
                                                                                                    </button>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <p className={cn("text-gray-300 mt-1 leading-relaxed", isCommenterCancelled && "line-through")}>
                                                                                                    {comm.comment}
                                                                                                </p>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-[10px] text-gray-500 italic pl-1">
                                                                            {locale === 'de' 
                                                                                ? 'Noch keine Kommentare. Schreibe den ersten, um dich abzusprechen!' 
                                                                                : 'No comments yet. Be the first to start the coordination!'}
                                                                        </p>
                                                                    )}

                                                                    {/* Comment Input */}
                                                                    <div className="flex gap-2 pt-1">
                                                                        <input
                                                                            type="text"
                                                                            placeholder={locale === 'de' ? 'Antwort schreiben...' : 'Write a reply...'}
                                                                            value={replyText[visit.id] || ""}
                                                                            onChange={(e) => setReplyText(prev => ({ ...prev, [visit.id]: e.target.value }))}
                                                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter') handlePostReply(visit.id);
                                                                            }}
                                                                        />
                                                                        <button
                                                                            onClick={() => handlePostReply(visit.id)}
                                                                            disabled={submittingReply[visit.id] || !(replyText[visit.id] || "").trim()}
                                                                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-[10px] uppercase tracking-wider px-3 rounded-xl transition-all active:scale-95 cursor-pointer"
                                                                        >
                                                                            {submittingReply[visit.id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (locale === 'de' ? 'Antworten' : 'Reply')}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {/* Add Visit Form */}
                                    <form onSubmit={handleCreateVisit} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                                        <h3 className="text-xs uppercase font-black text-white tracking-wider flex items-center gap-1.5">
                                            <Plus className="w-4 h-4 text-blue-400" />
                                            {locale === 'de' ? 'Neuen Termin planen' : 'Schedule a New Visit'}
                                        </h3>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">{locale === 'de' ? 'Datum' : 'Date'}</label>
                                                <input
                                                    type="date"
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase">{locale === 'de' ? 'Uhrzeit' : 'Time'}</label>
                                                <input
                                                    type="time"
                                                    value={visitTime}
                                                    onChange={(e) => setVisitTime(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">{locale === 'de' ? 'Beschreibung' : 'Description'}</label>
                                            <input
                                                type="text"
                                                value={visitDesc}
                                                onChange={(e) => setVisitDesc(e.target.value)}
                                                placeholder={locale === 'de' ? 'z.B. "Fahre mit 120L Board"' : 'e.g. "Riding 120L board"'}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submittingVisit}
                                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                                        >
                                            {submittingVisit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                                            {locale === 'de' ? 'Termin eintragen 🚀' : 'Schedule Visit 🚀'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Description Section */}
                            {spot.attributes?.description && (
                                <div className="text-sm text-foreground/90 whitespace-pre-line bg-muted/10 p-3 rounded-lg border border-border/50">
                                    {renderTextWithLinks(translatedDescription, setYoutubeVideoId)}
                                    {isDescriptionTranslated && (
                                        <p className="text-[10px] text-muted-foreground/60 italic mt-2 border-t border-border/30 pt-1.5">
                                            {t('ugc.ai_translated')}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Amenities Section - Premium 2x2 Glassmorphic facts grid */}
                            {(spot.attributes?.parking || spot.attributes?.charging || spot.attributes?.food || spot.attributes?.rental) && (
                                <div className="space-y-2.5">
                                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                                        {locale === 'de' ? 'Ausstattung & Merkmale' : 'Amenities & Features'}
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Parking Fact Card */}
                                        <div className={cn(
                                            "p-3 rounded-2xl border flex items-center gap-3 transition-colors",
                                            spot.attributes.parking 
                                                ? "bg-blue-500/5 border-blue-500/20 text-white" 
                                                : "bg-white/2 border-white/5 text-muted-foreground/40"
                                        )}>
                                            <Car className={cn("w-5 h-5 shrink-0", spot.attributes.parking ? "text-blue-400" : "text-muted-foreground/30")} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-extrabold truncate">{t('filters.parking')}</span>
                                                {spot.attributes.parking && spot.attributes.parking_distance ? (
                                                    <span className="text-[9px] text-muted-foreground truncate">{spot.attributes.parking_distance}</span>
                                                ) : (
                                                    <span className="text-[9px] text-muted-foreground/50 truncate">
                                                        {spot.attributes.parking ? (locale === 'de' ? 'Vorhanden' : 'Available') : (locale === 'de' ? 'Nein' : 'No')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Charging Fact Card */}
                                        <div className={cn(
                                            "p-3 rounded-2xl border flex items-center gap-3 transition-colors",
                                            spot.attributes.charging 
                                                ? "bg-green-500/5 border-green-500/20 text-white" 
                                                : "bg-white/2 border-white/5 text-muted-foreground/40"
                                        )}>
                                            <BatteryCharging className={cn("w-5 h-5 shrink-0", spot.attributes.charging ? "text-green-400" : "text-muted-foreground/30")} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-extrabold truncate">{t('filters.charging')}</span>
                                                <span className="text-[9px] text-muted-foreground/50 truncate">
                                                    {spot.attributes.charging ? (locale === 'de' ? 'Vorhanden' : 'Available') : (locale === 'de' ? 'Nein' : 'No')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Food Fact Card */}
                                        <div className={cn(
                                            "p-3 rounded-2xl border flex items-center gap-3 transition-colors",
                                            spot.attributes.food 
                                                ? "bg-orange-500/5 border-orange-500/20 text-white" 
                                                : "bg-white/2 border-white/5 text-muted-foreground/40"
                                        )}>
                                            <Utensils className={cn("w-5 h-5 shrink-0", spot.attributes.food ? "text-orange-400" : "text-muted-foreground/30")} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-extrabold truncate">{t('filters.food')}</span>
                                                <span className="text-[9px] text-muted-foreground/50 truncate">
                                                    {spot.attributes.food ? (locale === 'de' ? 'Vorhanden' : 'Available') : (locale === 'de' ? 'Nein' : 'No')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Rental Fact Card */}
                                        <div className={cn(
                                            "p-3 rounded-2xl border flex items-center gap-3 transition-colors",
                                            spot.attributes.rental 
                                                ? "bg-purple-500/5 border-purple-500/20 text-white" 
                                                : "bg-white/2 border-white/5 text-muted-foreground/40"
                                        )}>
                                            <Store className={cn("w-5 h-5 shrink-0", spot.attributes.rental ? "text-purple-400" : "text-muted-foreground/30")} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[11px] font-extrabold truncate">{t('filters.rental')}</span>
                                                <span className="text-[9px] text-muted-foreground/50 truncate">
                                                    {spot.attributes.rental ? (locale === 'de' ? 'Verleih' : 'Rental') : (locale === 'de' ? 'Nein' : 'No')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Photos Section */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">
                                        {t('forms.photo_upload')}
                                    </h3>
                                    <label className="inline-flex items-center gap-1 px-2 py-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded text-xs font-medium cursor-pointer transition-colors">
                                        {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                                        {t('forms.add_photo')}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>

                                {photos.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {photos.map((url, i) => (
                                            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={url} 
                                                    alt={`Spot photo ${i + 1}`} 
                                                    onClick={() => setLightboxPhoto(url)}
                                                    className="w-full h-full object-cover cursor-pointer hover:scale-105 hover:brightness-110 transition-all duration-300"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-xs text-muted-foreground italic p-4 text-center border border-dashed border-border rounded-lg">
                                        {t('forms.no_photos')}
                                    </div>
                                )}
                            </div>

                            {/* Suggest Edit Text Link */}
                            {isSpotCreator && (
                                <div className="flex justify-start pt-1">
                                    <button
                                        onClick={() => {
                                            if (!user) {
                                                setIsAuthOpen(true);
                                                return;
                                            }
                                            onEdit();
                                        }}
                                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 decoration-blue-500/30 transition-colors cursor-pointer"
                                    >
                                        {editSpotText[locale] || editSpotText['en']}
                                    </button>
                                </div>
                            )}

                            {/* Comments Section */}
                            <div className="space-y-4 border-t border-border/10 pt-6">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">
                                        {commentsHeaderText[locale] || commentsHeaderText['en']}
                                    </h3>
                                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                                        {questions.length}
                                    </span>
                                </div>

                                {/* Comment Submission Form */}
                                {user ? (
                                    <form onSubmit={handleQuestionSubmit} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newQuestion}
                                            onChange={(e) => setNewQuestion(e.target.value)}
                                            placeholder={commentPlaceholderText[locale] || commentPlaceholderText['en']}
                                            required
                                            disabled={submittingQuestion}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-blue-500/50 focus:outline-none"
                                        />
                                        <button
                                            type="submit"
                                            disabled={submittingQuestion}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                                        >
                                            {submittingQuestion ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (commentButtonText[locale] || commentButtonText['en'])}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="bg-muted/10 p-3.5 rounded-2xl border border-border text-center text-xs text-muted-foreground leading-normal">
                                        {commentSignInPrompt[locale] || commentSignInPrompt['en']}{" "}
                                        <button 
                                            type="button"
                                            onClick={() => setIsAuthOpen(true)}
                                            className="text-blue-400 font-bold hover:underline cursor-pointer border-none bg-transparent p-0"
                                        >
                                            {locale === 'de' ? 'Einloggen' : 'Sign In'}
                                        </button>
                                    </div>
                                )}

                                {/* Comments List */}
                                <div className="space-y-3">
                                    {questions.length > 0 ? (
                                        questions.map((q) => (
                                            <div key={q.id} className="bg-white/2 border border-white/5 p-4 rounded-2xl space-y-3 flex flex-col">
                                                {/* Comment Header & Content */}
                                                <div className="flex items-start gap-3 min-w-0">
                                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-900 border border-white/10 relative shrink-0 flex items-center justify-center">
                                                        {q.profiles?.avatar_url ? (
                                                            <img src={q.profiles.avatar_url} alt={q.profiles.username || "eFoiler"} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <UserIcon className="w-4 h-4 text-gray-500" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <button 
                                                                type="button"
                                                                onClick={() => onViewProfile?.(q.user_id)}
                                                                className="text-xs font-bold text-white hover:text-blue-400 transition-colors border-none bg-transparent p-0 cursor-pointer"
                                                            >
                                                                @{q.profiles?.username || "eFoiler"}
                                                            </button>
                                                            <span className="text-[9px] text-gray-500">
                                                                {new Date(q.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-200 mt-1 leading-relaxed break-words">{q.question}</p>
                                                    </div>
                                                </div>

                                                {/* Replies List */}
                                                {q.answers && q.answers.length > 0 && (
                                                    <div className="pl-6 border-l border-white/10 space-y-3 mt-1.5">
                                                        {q.answers.map((ans) => (
                                                            <div key={ans.id} className="flex items-start gap-2.5 min-w-0">
                                                                <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-900 border border-white/10 relative shrink-0 flex items-center justify-center">
                                                                    {ans.profiles?.avatar_url ? (
                                                                        <img src={ans.profiles.avatar_url} alt={ans.profiles.username || "eFoiler"} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <UserIcon className="w-3 h-3 text-gray-500" />
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        <button 
                                                                            type="button"
                                                                            onClick={() => onViewProfile?.(ans.user_id)}
                                                                            className="text-[11px] font-bold text-gray-300 hover:text-blue-400 transition-colors border-none bg-transparent p-0 cursor-pointer"
                                                                        >
                                                                            @{ans.profiles?.username || "eFoiler"}
                                                                        </button>
                                                                        <span className="text-[8px] text-gray-500">
                                                                            {new Date(ans.created_at).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-gray-300 mt-0.5 leading-relaxed break-words">{ans.answer}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Reply Trigger & Box */}
                                                <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/5">
                                                    {activeReplyBoxId === q.id ? (
                                                        <form 
                                                            onSubmit={(e) => handleAnswerSubmit(e, q.id)} 
                                                            className="flex gap-2 w-full mt-1.5"
                                                        >
                                                            <input
                                                                type="text"
                                                                value={newAnswerText}
                                                                onChange={(e) => setNewAnswerText(e.target.value)}
                                                                placeholder={replyPlaceholderText[locale] || replyPlaceholderText['en']}
                                                                required
                                                                disabled={submittingAnswer}
                                                                className="flex-1 bg-white/3 border border-white/5 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
                                                            />
                                                            <button
                                                                type="submit"
                                                                disabled={submittingAnswer}
                                                                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                                                            >
                                                                {submittingAnswer ? <Loader2 className="w-3 animate-spin" /> : (replyButtonText[locale] || replyButtonText['en'])}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setActiveReplyBoxId(null);
                                                                    setNewAnswerText("");
                                                                }}
                                                                className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-[10px] transition-colors cursor-pointer shrink-0"
                                                            >
                                                                X
                                                            </button>
                                                        </form>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (!user) {
                                                                    setIsAuthOpen(true);
                                                                    return;
                                                                }
                                                                setActiveReplyBoxId(q.id);
                                                            }}
                                                            className="text-[10px] text-muted-foreground hover:text-blue-400 font-bold transition-colors cursor-pointer border-none bg-transparent p-0 flex items-center gap-1"
                                                        >
                                                            💬 {replyButtonText[locale] || replyButtonText['en']}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-center text-gray-500 italic py-4">
                                            {noCommentsText[locale] || noCommentsText['en']}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Recent Reviews List */}
                            {reviews.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3 tracking-wider">{t('forms.community_reviews')}</h3>
                                    <div className="space-y-4">
                                        {reviews.map((rev) => (
                                            <ReviewItem 
                                                key={rev.id} 
                                                review={rev} 
                                                targetLang={locale} 
                                                t={t} 
                                                isAdmin={isAdmin}
                                                onDelete={() => handleAdminDeleteReview(rev.id)}
                                                onViewProfile={onViewProfile}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Verification Form */}
                            <div className="bg-muted/20 p-4 rounded-xl border border-border">
                                <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-3 tracking-wider">{t('forms.review_title')}</h3>
                                <div className="flex items-center gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={cn(
                                                    "w-8 h-8 transition-colors",
                                                    rating >= star ? "fill-yellow-400 text-yellow-500" : "text-input hover:text-yellow-200"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder={t('forms.review_placeholder')}
                                    className="w-full p-3 rounded-lg bg-background border border-input text-sm resize-none focus:ring-2 focus:ring-primary focus:outline-none h-20 mb-3"
                                />

                                <div className="flex gap-2 mb-3">
                                    <button
                                        onClick={handleVerify}
                                        disabled={verifying}
                                        className="flex-1 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ThumbsUp className="w-4 h-4" />}
                                        {hasExistingReview ? (t('forms.update_review') || "Update Review") : (t('forms.post_review') || "Post Review")}
                                    </button>

                                    {hasExistingReview && (
                                        <button
                                            onClick={handleDeleteReview}
                                            disabled={isDeletingReview}
                                            className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 font-bold rounded-lg transition-all flex items-center justify-center disabled:opacity-50"
                                            title="Bewertung löschen"
                                        >
                                            {isDeletingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                </div>

            </div>

            <AuthDialog 
                open={isAuthOpen} 
                onClose={() => setIsAuthOpen(false)} 
            />

            {/* Premium Full-Screen Image Lightbox */}
            {lightboxPhoto && (
                <div 
                    className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto"
                    onClick={() => setLightboxPhoto(null)}
                >
                    <button
                        type="button"
                        onClick={() => setLightboxPhoto(null)}
                        className="absolute top-6 right-6 p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div 
                        className="relative max-w-[90vw] max-h-[85vh] rounded-2xl overflow-hidden border border-white/15 shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={lightboxPhoto} 
                            alt="Enlarged preview" 
                            className="max-w-full max-h-[85vh] object-contain"
                        />
                    </div>
                </div>
            )}

            {/* YouTube Video Player Modal */}
            {youtubeVideoId && (
                <div 
                    className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto"
                    onClick={() => setYoutubeVideoId(null)}
                >
                    <button
                        type="button"
                        onClick={() => setYoutubeVideoId(null)}
                        className="absolute top-6 right-6 p-2 text-white/70 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div 
                        className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

interface ReviewItemProps {
    review: Review;
    targetLang: string;
    t: (key: string) => string;
    isAdmin?: boolean;
    onDelete?: () => void;
    onViewProfile?: (profileId: string) => void;
}

function ReviewItem({ review, targetLang, t, isAdmin, onDelete, onViewProfile }: ReviewItemProps) {
    const { translatedText: translatedComment, isTranslated } = useTranslate(review.comment, targetLang);

    return (
        <div className="p-4 bg-muted/20 rounded-2xl border border-border/50 transition-all hover:bg-muted/30 group">
            <div className="flex items-start gap-3 mb-2">
                {/* Avatar with Bio Popover */}
                <div className="relative group/avatar">
                    <button 
                        onClick={() => onViewProfile?.(review.user_id)}
                        className="w-10 h-10 rounded-full bg-gray-800 border border-border/50 overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-500/50 transition-all relative block focus:outline-none"
                    >
                        {review.profiles?.avatar_url ? (
                            <Image 
                                src={review.profiles.avatar_url} 
                                alt={review.profiles.username || "User"} 
                                width={40} 
                                height={40} 
                                sizes="40px"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <UserIcon className="w-5 h-5" />
                            </div>
                        )}
                    </button>

                    {/* Tooltip */}
                    {review.profiles?.bio && (
                        <div className="absolute top-full left-0 mt-2 w-48 p-3 bg-gray-900 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all z-50 text-xs text-gray-300 pointer-events-none">
                            <p className="font-bold text-white mb-1">{review.profiles.username}</p>
                            {review.profiles.bio}
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <button 
                            onClick={() => onViewProfile?.(review.user_id)}
                            className="text-sm font-bold text-foreground truncate hover:text-blue-400 hover:underline transition-colors border-none bg-transparent p-0 cursor-pointer text-left focus:outline-none"
                        >
                            @{review.profiles?.username || 'User'}
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                {new Date(review.created_at).toLocaleDateString()}
                            </span>
                            {isAdmin && onDelete && (
                                <button
                                    onClick={onDelete}
                                    className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Admin: Löschen"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                className={cn(
                                    "w-3 h-3",
                                    i < review.rating ? "fill-current" : "text-gray-600"
                                )} 
                            />
                        ))}
                    </div>
                    <p className="text-sm text-foreground/90 leading-relaxed italic">
                        &ldquo;{translatedComment}&rdquo;
                    </p>
                    {isTranslated && (
                        <p className="text-[10px] text-muted-foreground/60 italic mt-1.5 border-t border-border/10 pt-1">
                            {t('ugc.ai_translated')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
