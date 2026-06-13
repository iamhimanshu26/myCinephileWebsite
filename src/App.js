import React, { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  BrowserRouter as Router, Route, Routes, useLocation,
} from 'react-router-dom';
import 'swiper/swiper.min.css';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import './App.scss';

const Home = lazy(() => import('./pages/Home'));
const Details = lazy(() => import('./pages/Details'));
const Person = lazy(() => import('./pages/Person'));
const Search = lazy(() => import('./pages/Search'));
const Collection = lazy(() => import('./pages/Collection'));
const AnyIdea = lazy(() => import('./pages/AnyIdea'));
const HowWeBuiltIt = lazy(() => import('./pages/HowWeBuiltIt'));
const Booking = lazy(() => import('./pages/Booking'));
const BookingConfirmation = lazy(() => import('./pages/BookingConfirmation'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Profile = lazy(() => import('./pages/Profile'));
const CinephileAI = lazy(() => import('./pages/CinephileAI'));

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={`${location.pathname}${location.search}`}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/any-idea" element={<AnyIdea />} />
        <Route path="/how-we-built-it" element={<HowWeBuiltIt />} />
        <Route path="/movie/:id" element={<Details />} />
        <Route path="/person/:personId" element={<Person />} />
        <Route path="/booking/:movieId" element={<Booking />} />
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cinephile-ai" element={<CinephileAI />} />
      </Routes>
    </AnimatePresence>
  );
};

const RouteFallback = () => (
  <div className="app__route-loading" role="status" aria-live="polite">
    Loading page...
  </div>
);

function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <main id="main-content">
          <Suspense fallback={<RouteFallback />}>
            <AnimatedRoutes />
          </Suspense>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
