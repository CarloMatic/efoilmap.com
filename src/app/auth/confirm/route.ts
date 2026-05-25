import { createClient } from '@/lib/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  // Fallback: If redirected to default Vercel domain, rewrite origin to custom domain
  let redirectOrigin = origin;
  if (origin === 'https://efoilmapcom.vercel.app') {
    redirectOrigin = 'https://www.efoilmap.com';
  }

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return NextResponse.redirect(`${redirectOrigin}${next}`);
    } else {
      console.error("Auth Confirm Error:", error);
      return NextResponse.redirect(`${redirectOrigin}/auth/auth-error?error=${encodeURIComponent(error.message)}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${redirectOrigin}/auth/auth-error?error=Missing+token+hash+or+auth+type`);
}
