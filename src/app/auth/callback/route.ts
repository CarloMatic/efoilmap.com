import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  // Fallback: If redirected to default Vercel domain, rewrite origin to custom domain
  let redirectOrigin = origin;
  if (origin === 'https://efoilmapcom.vercel.app') {
    redirectOrigin = 'https://www.efoilmap.com';
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${redirectOrigin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${redirectOrigin}/auth/auth-error`);
}
