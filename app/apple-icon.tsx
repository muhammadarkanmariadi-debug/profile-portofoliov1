import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 88,
          background: '#0D0E11',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#EDEDEF',
          fontWeight: 900,
          borderRadius: 40,
          border: '7px solid rgba(255, 255, 255, 0.25)',
          fontFamily: 'monospace',
          letterSpacing: '-2px',
        }}
      >
        4R
      </div>
    ),
    {
      ...size,
    }
  )
}
