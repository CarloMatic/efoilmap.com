"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

export interface Profile {
    id: string;
    username: string | null;
    avatar_url?: string | null;
    bio?: string | null;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (!error && data) {
            setProfile(data);
        } else if (error && error.code === 'PGRST116') {
            // Profile doesn't exist yet, which is expected for new users
            setProfile({ id: userId, username: null });
        }
    };

    useEffect(() => {
        // Check active sessions
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) fetchProfile(currentUser.id);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) fetchProfile(currentUser.id);
            else setProfile(null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user) return { error: 'No user' };
        
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                ...updates,
            });
            
        if (!error) {
            setProfile(prev => prev ? { ...prev, ...updates } : null);
        }
        return { error };
    };

    return { user, session, profile, loading, signOut, updateProfile };
}
