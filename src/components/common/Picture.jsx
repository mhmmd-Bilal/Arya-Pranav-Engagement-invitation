import { useState } from 'react';
import images from '../../data/images.json';

/**
 * Responsive, graded photo from public/images/wedding/ (AVIF → WebP → JPG).
 * Intrinsic width/height prevent layout shift; a failed load leaves a quiet
 * cream panel instead of a broken-image icon.
 */
export default function Picture({ name, alt = '', sizes = '100vw', priority = false, className = '', imgClassName = '', style }) {
  const [failed, setFailed] = useState(false);
  const meta = images[name];
  if (!meta || failed) {
    return <div role={alt ? 'img' : undefined} aria-label={alt || undefined} className={`bg-linen ${className} ${imgClassName}`} style={style} />;
  }
  const set = (ext) => meta.widths.map((w) => `/images/wedding/${name}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`/images/wedding/${name}-${meta.fallback}.jpg`}
        width={meta.width}
        height={meta.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        draggable="false"
        onError={() => setFailed(true)}
        className={imgClassName}
        style={style}
      />
    </picture>
  );
}
