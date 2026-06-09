import Hero from '../components/Hero';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import BookingForm from '../components/BookingForm';

export default function Home() {
  return (
    <main>
      <Hero />
      <Gallery />
      <Reviews />
      <BookingForm />
    </main>
  );
}
