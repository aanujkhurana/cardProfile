import { images } from '../../constants'
import { motion } from 'framer-motion';

import './Footer.scss'

const Footer = () => {
  return (
    <footer className="footer">
      <motion.div 
        whileInView={{ y: [75, 45, 0], opacity: [0, 0, 1] }}
        transition={{ duration: 0.5 }}
      >
        <div className="footer__addr">
          <img src={images.logoFooter} alt='logo' />
          <h2>Find me at</h2>
          <address>
            Somewhere in; Gold Coast, Australia
          </address>
          <div className='footer__action'>
          <a className="footer__btn" href="https://raw.githubusercontent.com/aanujkhurana/Portfolio/master/frontend/src/assets/resume/AnujKhurana_CV.pdf">Download Resume</a>
          </div>
        </div>

        <div className="legal">
          <p>&copy; 2025 aanujkhurana. All rights reserved.</p>
          <div className="legal__links">
            <span>Made with <span className='heart'>♥</span> remotely from anywhere.</span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;