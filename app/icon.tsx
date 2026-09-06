import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 15,
          background: '#0D0E11',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#EDEDEF',
          fontWeight: 900,
          borderRadius: 7,
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          fontFamily: 'monospace',
          letterSpacing: '-0.5px',
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
