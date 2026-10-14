import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const alt = 'ErithX — Coding Contests, 1-Click Calendar Sync & Career Readiness';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#09090b',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          padding: '48px 56px',
          justifyContent: 'space-between',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Ambient background glows */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-100px',
            width: '550px',
            height: '550px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0) 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.16) 0%, rgba(6, 182, 212, 0) 70%)',
            display: 'flex',
          }}
        />

        {/* Decorative Grid Lines */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            display: 'flex',
          }}
        />

        {/* Top Header: Logo + Live Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-0.03em', color: '#ffffff' }}>
              Erith
            </span>
            <span style={{ fontSize: '42px', fontWeight: 900, letterSpacing: '-0.03em', color: '#10b981' }}>
              X
            </span>
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '8px 18px',
              borderRadius: '9999px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '9999px',
                backgroundColor: '#10b981',
                boxShadow: '0 0 10px #10b981',
                display: 'flex',
              }}
            />
            <span
              style={{
                color: '#34d399',
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              10+ Contest Platforms Live
            </span>
          </div>
        </div>

        {/* Center Content: Headline & Subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '1000px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#10b981',
              fontSize: '16px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            <span>THE ZERO-NOISE SANCTUARY FOR DEVELOPERS</span>
          </div>

          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Never miss a coding contest.</span>
            <span
              style={{
                color: '#10b981',
                display: 'flex',
              }}
            >
              1-Click Google Calendar Sync.
            </span>
          </h1>

          <p
            style={{
              fontSize: '22px',
              lineHeight: 1.45,
              color: '#a1a1aa',
              margin: 0,
              maxWidth: '880px',
            }}
          >
            Track LeetCode, Codeforces, CodeChef, and AtCoder in one place. Automated weekly DSA reviews, rating trends, and burnout-free placement prep.
          </p>
        </div>

        {/* Bottom Feature Cards */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            position: 'relative',
            zIndex: 10,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '24px',
          }}
        >
          {/* Feature Pills */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#e4e4e7',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              <span style={{ color: '#10b981' }}>📅</span>
              <span>1-Click Calendar Sync</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#e4e4e7',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              <span style={{ color: '#f59e0b' }}>⚡</span>
              <span>LeetCode & Codeforces</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#e4e4e7',
                fontSize: '15px',
                fontWeight: 600,
              }}
            >
              <span style={{ color: '#06b6d4' }}>📈</span>
              <span>Weekly DSA Reports</span>
            </div>
          </div>

          {/* Domain Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#10b981',
              color: '#09090b',
              padding: '10px 22px',
              borderRadius: '9999px',
              fontSize: '17px',
              fontWeight: 800,
              letterSpacing: '-0.01em',
            }}
          >
            <span>erithx.dev</span>
            <span style={{ fontSize: '18px' }}>→</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
