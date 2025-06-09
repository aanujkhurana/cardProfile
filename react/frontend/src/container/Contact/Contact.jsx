import { useState } from 'react';

import { images } from '../../constants';
import { AppWrap, MotionWrap } from '../../wrapper';
import { motion } from 'framer-motion';

import { client } from '../../client';

import './Contact.scss';


const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State to store input validation errors

  const { name, email, message } = formData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Clear previous errors
    setErrors({});

    // Perform input validation
    const validationErrors = {};
    if (!name.trim()) {
      validationErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Invalid email format';
    }
    if (!message.trim()) {
      validationErrors.message = 'Message is required';
    }

    // If there are validation errors, set them and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    // Submit form data
    const contact = {
      _type: 'contact',
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    client.create(contact)
      .then(() => {
        setLoading(false);
        setIsFormSubmitted(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h2 className="head-text">chat with <span> me</span></h2>
      <div className="app__contact-cards">
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.2, type: 'tween' }}
          className="app__contact-card"
        >
          <img src={images.email} alt="email" />
          <a href="mailto:aanujkhurana@gmail.com" className="p-text">aanujkhurana@gmail.com</a>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.2, type: 'tween' }}
          className="app__contact-card"
        >
          <img src={images.mobile} alt="phone" />
          <a href="tel:+61 (481) 25-0988" className="p-text">(+61)  48-125-0988</a>
        </motion.div>
      </div>
      
      {!isFormSubmitted ? (
        <div className="app__contact-form app__flex">
          <div className="app__flex">
            <input className="p-text" type="text" placeholder="Your Name" name="name" value={name} onChange={handleChangeInput} />
          </div>
          <div>
            {errors.name && <span className="form-error">{errors.name}</span> }
          </div>
          <div className="app__flex">
            <input className="p-text" type="email" placeholder="Your Email" name="email" value={email} onChange={handleChangeInput} />
          </div>
          <div>
            {errors.email && <span className="form-error">{errors.email}</span> }
          </div>
          <div>
            <textarea
              className="p-text"
              placeholder="Your Message"
              value={message}
              name="message"
              onChange={handleChangeInput}
            />
          </div>
          <div>
            {errors.message && <span className="form-error">{errors.message}</span>}
          </div>
          <button type="button" className="p-text" onClick={handleSubmit}>{!loading ? 'Send Message' : 'Sending...'}</button>
        </div>
      ) : 
      (
        <div>
          <h3 className="head-text">
            <span>Thank you!</span> for getting in touch.
          </h3>
        </div>
      )}
    </>
  )
}

export default AppWrap(
  MotionWrap(Contact, 'app__contact'),
  'contact',
  'app__primarybg',
);