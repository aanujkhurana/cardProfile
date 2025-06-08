import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

import { AppWrap, MotionWrap } from '../../wrapper';
import { urlFor, client } from '../../client';

import './Skills.scss';

const Skills = () => {

  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const query = '*[_type == "experiences"]';
    const skillsQuery = '*[_type == "skills"] | order(bgColor)';

    client.fetch(query).then((data) => {
      setExperiences(data);
    });

    client.fetch(skillsQuery).then((data) => {
      setSkills(data);
    });
  }, []);

  return (
    <>
    <h2 className='head-text'>Skills & <span>Experience</span></h2>
    <div className='app__skills-container'>

      <motion.div className='app__skills-list'>
        {skills.map((skill)=>(
          <motion.div
            whileHover={{scale: 1.2}}
            transition={{duration: 0.1, type: 'tween'}}
            whileInView={{opacity: [0, 1]}}
            className='app__skills-item app__flex'
            key={skill.name}
          >
            <div className='app__flex'>
              <img src={urlFor(skill.icon)} alt={skill.name} />
            </div>
            <p className='p-text'>{skill.name}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="app__skills-exp">
          {experiences.sort((b,a) => a.year.localeCompare(b.year)).map((experience) => (
            <motion.div
              key={experience.year}
              className="app__skills-exp-item"
            >
              <div className="app__skills-exp-year">
                <p className="bold-text">{experience.year}</p>
              </div>
              <motion.div className="app__skills-exp-works">
                {experience.works.map((work) => (
                  <div key={work.name}>
                    <motion.div
                      key={work.name}
                      data-tooltip-id={work.name}
                      whileInView={{ opacity: [0, 1] }}
                      transition={{ duration: 0.5 }}
                      className="app__skills-exp-work"
                    >
                      <h4 className="bold-text">{work.name}</h4>
                      <p className="p-text">{work.company}</p>
                    </motion.div>
                    <Tooltip id={work.name} className="skills-tooltip">
                      {work.desc}
                    </Tooltip>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
    </div>
    </>
  )
}

export default AppWrap(
  MotionWrap(Skills, 'app__skills'),
  'skills',
  'app__whitebg',
);