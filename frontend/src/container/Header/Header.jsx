import { motion } from 'framer-motion';
import { images } from '../../constants';
import { AppWrap } from '../../wrapper';

import './Header.scss'

const scaleVariants = {
  whileInView: {
    scale: [0, 1],
    opacity: [0, 1],
    transition: {
      duration: 1,
      ease: 'easeInOut',
    },
  },
};

const Header = () => {
  return (
    <div className='app__header app__flex'>
      <motion.div
        whileInView={{x: [-100,0], opacity: [0,1]}}
        transition={{duration: 1}}
        className='app__header'
      >
      <div className="app__header-badge">
        <div className="badge-cmp app__flex">
          <span>👋</span>
          <div style={{ marginLeft: 20 }}>
            <p className="p-text">Hi, I am</p>
            <h1 className="name__head-text">Anuj Khurana.</h1>
          </div>
        </div>
        <div className="tag-cmp app__flex">
          <p className="p-text">Full Stack Developer</p>
        </div>
      </div>
      </motion.div>
      <motion.div
        whileInView={{ opacity: [0, 1] }}
        transition={{ duration: 1, delayChildren: 1 }}
        className="app__header-img"
      >
        <img src={images.profile} alt="profile_bg" />
      <motion.img
        whileInView={{ scale: [0, 1] }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        src={images.circle}
        alt="profile_circle"
        className="overlay_circle"
      />
      </motion.div>
      
      <motion.div
        variants={scaleVariants}
        whileInView={scaleVariants.whileInView}
        className="app__header-circles"
      >
        {[images.htmlbundle, images.python, images.node].map((circle, index) => (
        <div className="circle-cmp app__flex" key={`circle-${index}`}>
          <img src={circle} alt="profile_bg" />
        </div>
      ))}
      </motion.div>
    </div>
  )
}

export default AppWrap(Header, 'home')