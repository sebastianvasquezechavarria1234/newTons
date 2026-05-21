import { forwardRef, type CSSProperties } from 'react';
import { type CardData } from '../types';

interface Props {
  card: CardData;
  style?: CSSProperties;
}

export const FloatingCard = forwardRef<HTMLDivElement, Props>(function FloatingCard({ card, style }, ref) {
  return (
    <div
      ref={ref}
      data-body-width="200"
      data-body-height="140"
      className="select-none"
      style={{
        ...style,
        width: 200,
        height: 140,
        borderRadius: 16,
        background: card.gradient,
        padding: 20,
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: 'white',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        transition: 'box-shadow 0.2s',
      }}
    >
      <span style={{ fontSize: 32, lineHeight: 1 }}>{card.icon}</span>
      <strong style={{ fontSize: 15, fontWeight: 600 }}>{card.title}</strong>
      <span style={{ fontSize: 11, opacity: 0.85, lineHeight: 1.3 }}>{card.description}</span>
    </div>
  );
});
