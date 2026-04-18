/**
 * HTML to React Component Wrapper Utility
 * Converts static HTML files into React components with proper styling
 */

import { type ReactNode } from 'react';

interface HtmlPageWrapperProps {
  htmlContent: string;
  title: string;
  className?: string;
}

/**
 * Generic wrapper component for HTML pages
 * Extracts the body content and renders it safely
 */
export function HtmlPageWrapper({ htmlContent, title, className = '' }: HtmlPageWrapperProps) {
  // Extract body content from HTML string
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;

  return (
    <div className={`html-page-wrapper ${className}`} title={title}>
      {/* Using dangerouslySetInnerHTML for static HTML content */}
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </div>
  );
}

/**
 * Create a React component from HTML string
 * Used for converting static HTML pages into React components
 */
export function createComponentFromHtml(htmlContent: string, displayName: string) {
  const Component = ({ title, className }: { title?: string; className?: string }) => (
    <HtmlPageWrapper
      htmlContent={htmlContent}
      title={title || displayName}
      className={className}
    />
  );

  Component.displayName = displayName;
  return Component;
}

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
