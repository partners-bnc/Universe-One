'use client';

// Section 01 · About the Company — entry point. It only puts the chapters in order;
// each chapter lives in ./components and all text/data lives in ./content.js.

import Hero from './components/Hero';
import Overview from './components/Overview';
import WhoWeAre from './components/WhoWeAre';
import Leadership from './components/Leadership';
import WhatWeDo from './components/WhatWeDo';
import Brands from './components/Brands';
import Partners from './components/Partners';
import Offices from './components/Offices';
import Websites from './components/Websites';
import SectionEnd from '../../_shared/SectionEnd';

export default function AboutCompany({ nextTitle, onNext }) {
  return (
    <div>
      <Hero />
      <div className="space-y-20 md:space-y-28">
        <Overview />
        <WhoWeAre />
        <Leadership />
        <WhatWeDo />
        <Brands />
        <Partners />
        <Offices />
        <Websites />
        <SectionEnd number="01" headline="You now know who we are and how we work." nextTitle={nextTitle} onNext={onNext} />
      </div>
    </div>
  );
}
