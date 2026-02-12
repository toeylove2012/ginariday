// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const menu = searchParams.get('menu') || 'กินอะไรดีวันนี้'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFBF0',
          backgroundImage: 'linear-gradient(135deg, #1C1917 0%, #292524 60%, #3b1100 100%)',
        }}
      >
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
          }}
        >
          {/* Emoji */}
          <div style={{ fontSize: '120px', marginBottom: '20px' }}>🍜</div>

          {/* Menu Name */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#F59E0B',
              textAlign: 'center',
              marginBottom: '20px',
              maxWidth: '900px',
            }}
          >
            {menu}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: '#A8A29E',
              textAlign: 'center',
            }}
          >
            กินอะไรดีวันนี้ | สุ่มเมนู • คำนวณแคล
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '24px', color: '#78716C' }}>
            ตารางโภชนาการ • วิธีทำ • วัตถุดิบ
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
