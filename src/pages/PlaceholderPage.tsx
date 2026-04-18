import { useNavigate } from 'react-router-dom';

/** Placeholder page for routes not yet built */
export default function PlaceholderPage({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-surface-container-low flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl text-primary/30">construction</span>
        </div>
        <h2 className="text-xl font-bold text-primary mb-2">{title}</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          This page is under construction and will be available in the next sprint.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-surface-container-low text-primary font-medium rounded-xl hover:bg-surface-container transition-colors text-sm"
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
