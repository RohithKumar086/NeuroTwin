interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  type?: 'text' | 'card' | 'chart' | 'circle';
}

export default function SkeletonLoader({ className = '', lines = 3, type = 'text' }: SkeletonLoaderProps) {
  if (type === 'card') {
    return (
      <div className={`rounded-xl p-5 ${className}`} style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
        <div className="skeleton h-4 w-24 mb-4" />
        <div className="skeleton h-8 w-20 mb-3" />
        <div className="skeleton h-3 w-32" />
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`rounded-xl p-5 ${className}`} style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
        <div className="skeleton h-4 w-32 mb-4" />
        <div className="skeleton h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (type === 'circle') {
    return <div className={`skeleton rounded-full ${className}`} />;
  }

  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 mb-2"
          style={{ width: `${70 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  );
}
