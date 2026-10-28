// The list of onboarding sections, in order. This is the ONE place to add a section:
// create a folder ./NN-section-name/ with an entry component, import it here and add an entry with `component`.
// Entries without `available: true` show as "Coming soon". "Mark as read" is saved per user in the browser (see _shell/OnboardingShell.jsx).

import AboutCompany from './01-about-company/AboutCompany';
import AboutFounders from './02-about-founders/AboutFounders';
import OurTeam from './03-our-team/OurTeam';
import RoleTeam from './04-role-team/RoleTeam';
import ToolsSystems from './05-tools-systems/ToolsSystems';

export const ONBOARDING_SECTIONS = [
  {
    id: 'about-company',
    number: '01',
    title: 'About the Company',
    description: 'Who we are, what we do and how BNC Global runs.',
    icon: 'apartment',
    available: true,
    component: AboutCompany,
  },
  {
    id: 'about-founders',
    number: '02',
    title: 'About the Founders',
    description: 'Meet the founders: their journey, expertise and what they lead.',
    icon: 'groups',
    available: true,
    component: AboutFounders,
  },
  {
    id: 'our-team',
    number: '03',
    title: 'Meet the Team',
    description: 'The colleagues you will work with, by department.',
    icon: 'diversity_3',
    available: true,
    component: OurTeam,
  },
  {
    id: 'role-team',
    number: '04',
    title: 'Your Role & Team',
    description: 'Your role, reporting manager, teammates and documents.',
    icon: 'badge',
    available: true,
    component: RoleTeam,
  },
  {
    id: 'tools-systems',
    number: '05',
    title: 'Tools & Systems',
    description: 'How to use Universe One and our other platforms, step by step.',
    icon: 'widgets',
    available: true,
    component: ToolsSystems,
  },
  {
    id: 'culture-values',
    number: '06',
    title: 'Culture & Values',
    description: 'How we work together and what we stand for.',
    icon: 'volunteer_activism',
    available: false,
  },
  {
    id: 'policies',
    number: '07',
    title: 'Policies & Code of Conduct',
    description: 'The rules and expectations every employee follows.',
    icon: 'gavel',
    available: false,
  },
];
