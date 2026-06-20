import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const visitId = searchParams.get('visit');

    let visitData: any = null;
    let spotPhotoUrl: string | null = null;

    if (visitId) {
      // Fetch visit data with spot name and creator username
      const { data, error } = await supabase
        .from('spot_visits')
        .select(`
          id,
          visit_date,
          visit_time,
          description,
          spot_id,
          spots (
            name
          ),
          profiles (
            username
          )
        `)
        .eq('id', visitId)
        .maybeSingle();

      if (!error && data) {
        visitData = data;
        
        // Fetch first photo of the spot
        const { data: photoData } = await supabase
          .from('spot_photos')
          .select('url')
          .eq('spot_id', data.spot_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (photoData) {
          spotPhotoUrl = photoData.url;
        }
      }
    }

    // Determine background image (fallback to teaser.jpg)
    const bgImage = spotPhotoUrl || `${origin}/teaser.jpg`;

    // Format appointment details in English
    const spotName = visitData?.spots?.name || 'eFoil Spot';
    const creator = visitData?.profiles?.username ? `@${visitData.profiles.username}` : 'eFoiler';
    const description = visitData?.description || 'Join us for a session!';
    
    let formattedDate = 'Upcoming Session';
    let formattedTime = '';

    if (visitData?.visit_date) {
      try {
        const dateObj = new Date(visitData.visit_date);
        formattedDate = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch (e) {
        formattedDate = visitData.visit_date;
      }
    }
    
    if (visitData?.visit_time) {
      formattedTime = visitData.visit_time.substring(0, 5);
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            fontFamily: 'sans-serif',
            color: '#fff',
          }}
        >
          {/* Dark blue overlay to ensure readability */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, rgba(10, 15, 30, 0.95) 0%, rgba(10, 15, 30, 0.9) 45%, rgba(10, 15, 30, 0.4) 100%)',
              display: 'flex',
            }}
          />

          {/* Top header branding */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '40px 60px 0 60px',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6',
                  boxShadow: '0 0 12px #3b82f6',
                }}
              />
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  letterSpacing: '1px',
                  color: '#3b82f6',
                  textTransform: 'uppercase',
                }}
              >
                eFoilMap.com
              </span>
            </div>
            
            <div
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.6)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '6px 16px',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              eFoil Session invitation
            </div>
          </div>

          {/* Main Content Area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '0 60px',
              justifyContent: 'center',
              flexGrow: 1,
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#3b82f6',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '8px',
              }}
            >
              Let's ride together @
            </span>
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 900,
                margin: 0,
                color: '#ffffff',
                lineHeight: 1.1,
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
              }}
            >
              {spotName}
            </h1>

            {/* Appointment Glass Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '30px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px 30px',
                maxWidth: '650px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '30px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '22px', fontWeight: 800 }}>
                  <span style={{ marginRight: '8px' }}>📅</span>
                  {formattedDate}
                </div>
                {formattedTime && (
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '22px', fontWeight: 800, color: '#3b82f6' }}>
                    <span style={{ marginRight: '8px' }}>⏰</span>
                    {formattedTime}
                  </div>
                )}
              </div>
              
              <div
                style={{
                  fontSize: '20px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontStyle: 'italic',
                  lineHeight: '1.4',
                }}
              >
                &ldquo;{description}&rdquo;
              </div>
            </div>
          </div>

          {/* Footer Branding / Creator */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 60px 40px 60px',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '20px',
                }}
              >
                🏄
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)' }}>Organized by</span>
                <span style={{ fontSize: '18px', fontWeight: 800 }}>{creator}</span>
              </div>
            </div>

            <span style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600 }}>
              Join the session on eFoilMap.com
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: any) {
    console.error('OG Image Generation Error:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
