import React from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  BrowserRouter as Router, Route, Routes, useLocation,
} from 'react-router-dom';
import 'swiper/swiper.min.css';
import Header from './components/header/Header';
import Home from './pages/Home';
import Details from './pages/Details';
import Person from './pages/Person';
import Search from './pages/Search';
import Collection from './pages/Collection';
import AnyIdea from './pages/AnyIdea';
import Footer from './components/footer/Footer';
import './App.scss';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={`${location.pathname}${location.search}`}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/any-idea" element={<AnyIdea />} />
        <Route path="/movie/:id" element={<Details />} />
        <Route path="/person/:personId" element={<Person />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <main id="main-content">
          <AnimatedRoutes />
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
