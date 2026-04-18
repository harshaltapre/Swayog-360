import { type ReactNode } from 'react';

/**
 * Wrapper component for imported HTML-based pages
 * Provides consistent styling and structure
 */
export function PageContainer({
  children,
  title,
  subtitle,
  className = '',
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={`min-h-screen bg-surface-dim ${className}`}>
      {title && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-on-background">{title}</h1>
          {subtitle && <p className="text-on-background/70 mt-2">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
