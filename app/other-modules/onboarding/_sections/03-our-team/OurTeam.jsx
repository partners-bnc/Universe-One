'use client';

// Section 03 · Meet the Team — entry point. Loads the team once from HRM and passes it to each part.
import useTeamMembers from './useTeamMembers';
import { SECTION_END } from './content';
import TeamHero from './components/TeamHero';
import Departments from './components/Departments';
import TeamDirectory from './components/TeamDirectory';
import SectionEnd from '../../_shared/SectionEnd';

export default function OurTeam({ nextTitle, onNext }) {
  const { members, loading, error } = useTeamMembers();
  return (
    <div>
      <TeamHero members={members} loading={loading} error={error} />
      <div className="space-y-20 md:space-y-28">
        <Departments members={members} loading={loading} />
        <TeamDirectory members={members} loading={loading} error={error} />
        <SectionEnd number={SECTION_END.number} headline={SECTION_END.headline} nextTitle={nextTitle} onNext={onNext} />
      </div>
    </div>
  );
}
