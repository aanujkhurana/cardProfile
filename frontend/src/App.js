import React from 'react';

import { About, Work, Skills, Footer, Header, Contact } from './container';
import { NavBar } from './components';

import './App.scss';

const App = () => {
  return (
    <div className='app'>
        <NavBar />
        <Header />
        <About />
        <Work />
        <Skills />
        <Contact />
        <Footer />
    </div>
  )
}

export default App