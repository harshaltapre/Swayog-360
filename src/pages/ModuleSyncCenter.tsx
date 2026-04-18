import { useEffect, useMemo, useState } from 'react';
import { MODULE_GROUPS } from '../config/modules';

type SyncStatus = {
  backend: string;
  database: string;
  schema: string;
  counts: Record<string, number>;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export default function ModuleSyncCenter() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/api/sync/status`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Sync check failed (${response.status})`);
        }
        return response.json() as Promise<SyncStatus>;
      })
      .then((payload) => {
        if (active) {
          setStatus(payload);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to read sync status');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const moduleTotal = useMemo(() => MODULE_GROUPS.reduce((total, group) => total + group.items.length, 0), []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h2 className="text-display text-primary">Workspace Sync Center</h2>
          <p className="text-on-surface-variant mt-1 text-sm">
            All prototype folders grouped by role with their corresponding dashboard routes.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="px-4 py-2 rounded-xl bg-surface-container-low text-sm text-primary font-medium">
            {moduleTotal} modules indexed
          </span>
          <span className="px-4 py-2 rounded-xl bg-surface-container-low text-sm text-primary font-medium">
            {loading ? 'Checking backend...' : status?.backend === 'online' ? 'Backend online' : 'Backend unavailable'}
          </span>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-low p-5">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant/60">Backend</p>
          <h3 className="mt-2 text-title text-primary">{loading ? 'Loading...' : status?.backend ?? 'Offline'}</h3>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-low p-5">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant/60">Database</p>
          <h3 className="mt-2 text-title text-primary">{loading ? 'Loading...' : status?.database ?? 'Unavailable'}</h3>
          <p className="text-sm text-on-surface-variant mt-1">{loading ? 'Verifying connection' : status?.schema ?? 'No schema response'}</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-low p-5">
          <p className="text-xs uppercase tracking-widest text-on-surface-variant/60">Error</p>
          <h3 className="mt-2 text-title text-primary">{error ?? 'No issues detected'}</h3>
        </div>
      </section>

      {status ? (
        <section className="bg-surface-container-lowest rounded-2xl border border-surface-container-low p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-title text-primary">Database Coverage</h3>
            <span className="text-sm text-on-surface-variant">Live counts from Prisma models</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
            {Object.entries(status.counts).map(([key, value]) => (
              <div key={key} className="rounded-xl border border-surface-container-low bg-surface p-3">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">{key}</p>
                <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {MODULE_GROUPS.map((group) => (
        <section key={group.title} className="bg-surface-container-lowest rounded-2xl border border-surface-container-low overflow-hidden">
          <div className="p-5 border-b border-surface-container-low">
            <h3 className="text-title text-primary">{group.title}</h3>
            <p className="text-sm text-on-surface-variant mt-1">{group.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
            {group.items.map((item) => (
              <article key={`${item.folder}-${item.route}`} className="bg-surface rounded-2xl border border-surface-container-low p-4 flex flex-col gap-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant/60">{item.role}</p>
                    <h4 className="font-semibold text-primary mt-1">{item.label}</h4>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-1 rounded-full ${item.status === 'live' ? 'bg-on-tertiary-container/10 text-on-tertiary-container' : item.status === 'placeholder' ? 'bg-error-container text-error' : 'bg-surface-container text-on-surface-variant'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant">{item.description}</p>
                <div className="text-xs text-on-surface-variant space-y-1">
                  <p><span className="font-medium text-primary">Folder:</span> {item.folder}</p>
                  <p><span className="font-medium text-primary">Route:</span> {item.route}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
