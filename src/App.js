import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'swiper/swiper.min.css';
import Header from './components/header/Header';
import Home from './pages/Home';
import Details from './pages/Details';
import Person from './pages/Person';
import Search from './pages/Search';
import Collection from './pages/Collection';
import Footer from './components/footer/Footer';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <main id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/movie/:id" element={<Details />} />
            <Route path="/person/:personId" element={<Person />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
