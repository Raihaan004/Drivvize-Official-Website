'use client';

import React from 'react';
import { IMG } from './data';
import { Photo, Reveal } from './hooks';

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-24 lg:py-44">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 sm:gap-14 lg:grid-cols-12 lg:gap-16 px-5 sm:px-6 lg:px-10">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow mb-6 sm:mb-8 text-brand">Who we are</p>
            <p className="title text-[clamp(1.4rem,2.5vw,2.5rem)] !leading-[1.28] sm:!leading-[1.25] text-ink/55">
              Drivvize is your trusted partner for <b className="text-ink">functional safety</b> and{' '}
              <b className="text-ink">cybersecurity</b> challenges. We help{' '}
              <b className="text-ink">Automotive OEMs</b> and <b className="text-ink">Suppliers</b> move forward with clarity — turning functional safety, cybersecurity, and
              software-defined vehicle challenges into structured engineering progress.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 sm:mt-10 max-w-lg text-[15px] sm:text-[16px] leading-relaxed text-ink/65">
              Whether you are building next-generation ECUs, scaling ADAS capabilities, or navigating evolving regulations, we partner with your teams to reduce
              uncertainty, accelerate decisions, and embed safety and security into the DNA of your development lifecycle.
            </p>
          </Reveal>
        </div>

        <div className="relative grid grid-cols-12 gap-3 sm:gap-4 lg:col-span-6">
          <Photo
            src={IMG.neon}
            alt="Car headlight glowing blue at night"
            className="col-span-7 aspect-[3/4] rounded-xl sm:rounded-none"
            speed={0.05}
          />
          <Photo
            src={IMG.engineer}
            alt="Engineer working at a laptop"
            className="col-span-5 mt-8 sm:mt-16 lg:mt-24 aspect-[3/4] rounded-xl sm:rounded-none"
            speed={0.09}
            delay={250}
          />
        </div>
      </div>
    </section>
  );
}

