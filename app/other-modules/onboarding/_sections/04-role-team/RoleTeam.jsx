'use client';

// Section 04 · Your Role & Team — entry point. Loads the signed-in employee's HRM profile once and passes it to each part.
import useMyProfile from './useMyProfile';
import { SECTION_END } from './content';
import RoleHero from './components/RoleHero';
import ReportingLine from './components/ReportingLine';
import RoleDetails from './components/RoleDetails';
import AboutYou from './components/AboutYou';
import Documents from './components/Documents';
import SectionEnd from '../../_shared/SectionEnd';
import { Icon } from '../../_shared/ui';

function Loading() {
  return (
    <div className="grid min-h-[100svh] items-center gap-12 pt-20 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-4">
        <div className="h-14 w-3/4 animate-pulse rounded-2xl bg-[#f0f4fb]" />
        <div className="h-14 w-2/3 animate-pulse rounded-2xl bg-[#f0f4fb]" />
        <div className="h-20 w-full animate-pulse rounded-2xl bg-[#f6f9fd]" />
      </div>
      <div className="mx-auto h-[480px] w-[320px] animate-pulse rounded-[30px] bg-[#f0f4fb]" />
    </div>
  );
}

export default function RoleTeam({ nextTitle, onNext }) {
  const { data, loading, error } = useMyProfile();
  if (loading) return <Loading />;
  if (error || !data) {
    return (
      <div className="grid min-h-[80svh] place-items-center">
        <div className="max-w-[440px] text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eef4fd] text-[var(--ob-blue)]">
            <Icon name="badge" className="text-[26px]" />
          </span>
          <p className="mt-5 text-[22px] font-bold text-[var(--ob-ink)]">We couldn’t load your profile.</p>
          <p className="mt-2 text-[14.5px] text-[var(--ob-body)]">{error || 'Please refresh the page.'} If this keeps happening, ask HR to check your HRM profile.</p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <RoleHero data={data} />
      <div className="space-y-20 md:space-y-28">
        <ReportingLine data={data} />
        <RoleDetails data={data} />
        <AboutYou data={data} />
        <Documents data={data} />
        <SectionEnd number={SECTION_END.number} headline={SECTION_END.headline} nextTitle={nextTitle} onNext={onNext} />
      </div>
    </div>
  );
}
