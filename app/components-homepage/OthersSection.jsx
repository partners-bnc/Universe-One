import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ModuleCardsSkeleton } from './ExperienceLoaders';

// Card height: on laptops (4 columns, 2 rows) the cards shrink with the screen height so all eight fit
// without scrolling; on tablets and phones they keep a fixed height and the page scrolls.
export const MODULE_CARD_HEIGHT = 'h-[230px] xl:h-[clamp(160px,calc((100svh-300px)/2),250px)]';
const MEDIA_TIMEOUT_MS = 8000; // show the cards anyway if a video never finishes loading

const otherModules = [
  {
    id: 'onboarding',
    title: 'Onboarding',
    // same cover video as the HRM card for now; swap in an onboarding-specific MP4 here when one is ready
    image: '/assets/hrm.jpeg',
    video: '/assets/WhatsApp Video 2026-07-15 at 1.21.57 PM.mp4',
    accessKey: 'onboarding',
  },
  {
    id: 'auditing',
    title: 'Auditing',
    image: '/assets/Audit.jpeg',
    video: '/assets/gif 4th.mp4',
    accessKey: 'auditing',
  },
  {
    id: 'task-management',
    title: 'Task Management',
    image: '/assets/task.jpeg',
    video: '/assets/gif 3rd.mp4',
    accessKey: 'taskManager',
  },
  {
    id: 'hrm',
    title: 'HRM',
    image: '/assets/hrm.jpeg',
    video: '/assets/WhatsApp Video 2026-07-15 at 1.21.57 PM.mp4',
    accessKey: 'hrm',
  },
  {
    id: 'crm',
    title: 'CRM',
    image: '/assets/crm.jpeg',
    video: '/assets/gif 2nd.mp4',
    accessKey: 'crm',
  },
  {
    id: 'vendor',
    title: 'Vendora',
    image: '/assets/other.gif',
    video: '/assets/other 1.mp4',
    accessKey: 'vendor',
  },
  {
    id: 'far',
    title: 'FAR',
    image: '/assets/crm.jpeg',
    video: '/assets/other 2.mp4',
    accessKey: 'far',
  },
  {
    id: 'finance',
    title: 'Finance',
    image: '/assets/Audit.jpeg',
    video: '/assets/gif 4th.mp4',
    accessKey: 'finance',
  },
];

export function OthersSection({ modules: moduleAccessMap = {}, loading = false, className = '' }) {
  const [activeDialog, setActiveDialog] = useState(null);
  // Hold the cards behind a loader until every cover video/image and the arrow icon font are ready,
  // then show them all at once (instead of empty cards filling in one by one).
  const [loadedMedia, setLoadedMedia] = useState(() => new Set());
  const [iconsReady, setIconsReady] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const markLoaded = useCallback((id) => {
    setLoadedMedia((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  useEffect(() => {
    // The icon font is ready when "arrow_forward" draws as one square icon instead of the plain word.
    // (Asking document.fonts too early says "ready" before the icon stylesheet has even arrived.)
    const probe = document.createElement('span');
    probe.className = 'material-symbols-outlined';
    probe.textContent = 'arrow_forward';
    probe.setAttribute('aria-hidden', 'true');
    Object.assign(probe.style, { position: 'absolute', left: '-9999px', top: '0', fontSize: '20px', visibility: 'hidden' });
    document.body.appendChild(probe);
    const poll = setInterval(() => {
      if (probe.offsetWidth > 0 && probe.offsetWidth < 40) { setIconsReady(true); clearInterval(poll); }
    }, 100);
    const timer = setTimeout(() => setTimedOut(true), MEDIA_TIMEOUT_MS);
    return () => { clearInterval(poll); clearTimeout(timer); probe.remove(); };
  }, []);

  const modules = useMemo(
    () =>
      otherModules.map((module) => {
        if (module.id === 'onboarding') {
          // Onboarding access is always enabled for signed-in users
          return {
            ...module,
            enabled: true,
            href: '/other-modules/onboarding',
          };
        }
        if (module.id === 'far') {
          const isEnabled = Boolean(moduleAccessMap?.far?.enabled);
          return {
            ...module,
            enabled: isEnabled,
            href: isEnabled ? '/other-modules/far' : null,
          };
        }
        if (module.id === 'finance') {
          const isEnabled = Boolean(moduleAccessMap?.finance?.enabled);
          return {
            ...module,
            enabled: isEnabled,
            href: isEnabled ? '/other-modules/finance' : null,
          };
        }
        return {
          ...module,
          enabled: Boolean(moduleAccessMap?.[module.accessKey]?.enabled),
          href: moduleAccessMap?.[module.accessKey]?.href || null,
        };
      }),
    [moduleAccessMap]
  );
  const ready = !loading && (timedOut || (iconsReady && loadedMedia.size >= otherModules.length));

  return (
    <section id="others-section" className={`w-full flex flex-col gap-6 md:gap-4 items-center justify-center bg-transparent ${className}`.trim()}>

      {/* Header Block - compact so all eight cards fit on a laptop screen */}
      <div className="w-full relative h-auto py-3 md:py-0 flex flex-col justify-center items-center text-center overflow-visible shrink-0 bg-transparent">

        {/* Stylish Typography - Adjusted margins for mobile clearance */}
        <div className="relative z-20 flex flex-col items-center px-6 mt-1 md:mt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.28em] text-black mb-2.5 bg-white/95 border border-slate-200 shadow-xs">
            Other Modules
          </span>

          <h2 className="text-[28px] leading-tight md:text-[34px] xl:text-[38px] font-serif font-medium italic tracking-tight text-black mt-0">
            Access all your operations in one platform
          </h2>
        </div>
      </div>

      {/* Cards Container - Constrained to max-w-[1440px] and centered */}
      <div className="relative w-full max-w-[1440px] px-6 md:px-8 mt-3 md:mt-5">
        {/* while access is loading the skeleton takes the space; after that it covers the (still hidden) cards until their media is ready */}
        {loading ? <ModuleCardsSkeleton count={otherModules.length} cardClassName={MODULE_CARD_HEIGHT} /> : null}
        {!loading && !ready ? (
          <div className="absolute inset-x-6 top-0 z-10 md:inset-x-8">
            <ModuleCardsSkeleton count={otherModules.length} cardClassName={MODULE_CARD_HEIGHT} />
          </div>
        ) : null}
        {loading ? null : (
          <div
            className={`grid gap-5 md:grid-cols-2 xl:grid-cols-4 w-full transition-opacity duration-500 ${ready ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            aria-busy={!ready}
          >
            {modules.map((module) => {
              const isEnabled = module.enabled;
              const statusClassName = isEnabled
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/50'
                : 'bg-red-50 text-red-600 ring-red-200/50';

              const cardClassName = `relative block w-full ${MODULE_CARD_HEIGHT} overflow-hidden rounded-[28px] border text-left shadow-[0_12px_45px_rgba(15,23,42,0.05),0_3px_0_rgba(226,232,240,0.9)] backdrop-blur transition-all duration-500 [transform-style:preserve-3d] ${isEnabled
                ? 'border-blue-200/60 bg-white hover:-translate-y-2 hover:[transform:rotateX(6deg)_rotateY(-4deg)_translateZ(10px)] hover:shadow-[0_28px_70px_rgba(3,114,204,0.15),0_4px_0_rgba(147,197,253,0.9)]'
                : 'border-blue-200/60 bg-white hover:-translate-y-1 hover:[transform:rotateX(4deg)_rotateY(-2deg)_translateZ(5px)]'
                }`;

              const handleModuleClick = (event) => {
                if (module.href) {
                  return;
                }

                event.preventDefault();
                setActiveDialog({
                  title: isEnabled ? `${module.title} Not Ready Yet` : `No Access To ${module.title}`,
                  message: isEnabled
                    ? `${module.title} access is enabled for your account, but this module page is not available yet.`
                    : `You do not have access to the ${module.title} module. Please contact HR Admin if you need access.`,
                });
              };

              return (
                <div key={module.id} className="group relative [perspective:1400px]">
                  <Link
                    href={module.href || '#'}
                    onClick={handleModuleClick}
                    className={cardClassName}
                  >
                    {/* Full cover image or video inside card */}
                    <div className="absolute inset-0 z-0 h-full w-full">
                      {module.video ? (
                        <video
                          ref={(el) => { if (el && el.readyState >= 2) markLoaded(module.id); }}
                          onLoadedData={() => markLoaded(module.id)}
                          onError={() => markLoaded(module.id)}
                          src={module.video}
                          poster={module.image}
                          preload="auto"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        />
                      ) : (
                        <img
                          ref={(el) => { if (el?.complete) markLoaded(module.id); }}
                          onLoad={() => markLoaded(module.id)}
                          onError={() => markLoaded(module.id)}
                          src={module.image}
                          alt={module.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        />
                      )}
                      <div className="absolute inset-0 bg-slate-950/10 transition-opacity duration-300 group-hover:opacity-0" />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ring-1 flex items-center gap-1.5 ${statusClassName}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${isEnabled ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        Access {isEnabled ? 'On' : 'Off'}
                      </span>
                    </div>

                    {/* Taller transparent overlay light white gradient (bottom 35% overlay) containing large title & interactive action button */}
                    <div className="absolute bottom-0 inset-x-0 h-[35%] bg-gradient-to-t from-white via-white/85 to-transparent flex items-end justify-between pb-6 px-6 z-20">
                      <h3 className={`font-black tracking-tight text-slate-800 transition-colors duration-300 group-hover:text-[#0372CC] ${
                        module.title.length > 20 ? 'text-sm md:text-base leading-snug max-w-[78%]' : 'text-xl md:text-2xl'
                      }`}>
                        {module.title}
                      </h3>

                      {/* Interactive Action Button indicating clickability */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-xs transition-all duration-300 group-hover:border-[#0372CC] group-hover:bg-[#0372CC] group-hover:text-white group-hover:scale-110 group-hover:shadow-md">
                        <span className={`material-symbols-outlined text-[20px] font-bold ${iconsReady ? '' : 'invisible'}`}>arrow_forward</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {activeDialog ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-[1.75rem] border border-white/80 bg-white p-6 shadow-[0_30px_70px_rgba(15,23,42,0.20)]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <span className="material-symbols-outlined text-[24px]">lock</span>
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900">{activeDialog.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{activeDialog.message}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveDialog(null)}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
