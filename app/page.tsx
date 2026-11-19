import Nav from '@/components/premium-home/Nav';
import Hero from '@/components/premium-home/Hero';
import About from '@/components/premium-home/About';
import Band from '@/components/premium-home/Band';
import Partner from '@/components/premium-home/Partner';
import Proof from '@/components/premium-home/Proof';
import Systems from '@/components/premium-home/Systems';
import Recognition from '@/components/premium-home/Recognition';
import Founders from '@/components/premium-home/Founders';
import Footer from '@/components/premium-home/Footer';
import UpcomingEventToast from '@/components/events/UpcomingEventToast';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Band />
        <Partner />
        <Proof />
        <Systems />
        <Recognition />
        <Founders />
      </main>
      <Footer />
      <UpcomingEventToast />
    </>
  );
}
