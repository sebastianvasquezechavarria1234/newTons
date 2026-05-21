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
      data-body-width="190"
      data-body-height="300"
      className="select-none"
      style={{
        ...style,
        width: 190,
        height: 300,
        borderRadius: 16,
        background: `url(${card.image}) center / cover`,
        cursor: 'grab',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'box-shadow 0.2s',
      }}
    ></div>
  );
});
