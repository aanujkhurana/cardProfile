import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { motion } from 'framer-motion';

const SocialMedia = () => (
  <motion.div 
    className="app__social app__flex"
    whileInView={{ scale: [0.85,1] }}
    transition={{ duration: 1, type: 'tween' }}
  >
    <div>
      <a href="https://github.com/aanujkhurana" target="_blank" rel="noreferrer">
        <FaGithub />
      </a>
    </div>
    <div>
      <a href="https://www.linkedin.com/in/aanujkhurana" target="_blank" rel="noreferrer">
        <FaLinkedin />
      </a>
    </div>
    <div>
      <a href="https://www.facebook.com/aanujkhurana" target="_blank" rel="noreferrer">
        <FaFacebook />
      </a>
    </div>
  </motion.div>
);

export default SocialMedia;
