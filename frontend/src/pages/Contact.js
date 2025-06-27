import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Users } from 'lucide-react';
import '../styles/Contact.css';
import Header from './Header';
import Footer from './Footer';

// Add this to your index.html or import with JS for web fonts
// <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Poppins:wght@700&display=swap" rel="stylesheet">

const teamMembers = [
  {
    name: 'Sameer Hussain',
    url: 'https://www.instagram.com/sam_shaik24/',
  },
  {
    name: 'Mahaboob Basha',
    url: 'https://www.instagram.com/',
  },
  {
    name: 'Javeriya',
    url: 'https://www.instagram.com/',
  },
  {
    name: 'Sania Muskan',
    url: 'https://www.instagram.com/',
  }
];

const Contact = () => {
  return (
    <>
      <Header />

    <div className="contact-container">
      <motion.div
        className="contact-card"
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h1
          className="contact-title"
          initial={{ y: -50, opacity: 0, rotate: -2 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.25, duration: 0.7, type: 'spring', stiffness: 180 }}
        >
          Contact Us
        </motion.h1>

        <motion.p
          className="contact-subtext"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          Get in touch anytime.<br />We're here to help!
        </motion.p>

        <motion.a
          href="tel:0741046208"
          className="call-box"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.08,
            boxShadow: '0 12px 40px 0 rgba(255, 45, 85, 0.36)',
            background: 'linear-gradient(90deg,#f87171 0%, #dc2626 100%)',
          }}
          transition={{ delay: 0.8, duration: 0.7, type: 'spring', stiffness: 160 }}
        >
          <motion.div
            initial={{ rotate: -15, scale: 0.85 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.95, duration: 0.7, type: 'spring', stiffness: 200 }}
          >
            <PhoneCall className="phone-icon" />
          </motion.div>
          <span className="call-number">Call 0741046208</span>
          <span className="call-description">for more details</span>
        </motion.a>

        {/* Team Section */}
        <motion.div
          className="team-section"
          initial="hidden"
          animate="visible"
        >
          <motion.div className="team-title-box"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.05, duration: 0.7 }}
          >
            <Users className="users-icon" />
            <span className="team-title">Our Team</span>
          </motion.div>
          
          {/* Team grid in two rows, 2+2, last one centered */}
          <div className="team-grid">
            <div className="team-row">
              <motion.a
                href={teamMembers[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="team-member-card"
                whileHover={{
                  y: -8,
                  scale: 1.07,
                  boxShadow: '0 8px 32px 0 #833AB44a',
                  borderColor: '#FCAF45',
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="team-member-name">{teamMembers[0].name}</span>
                <span className="insta-icon" />
              </motion.a>
              <motion.a
                href={teamMembers[1].url}
                target="_blank"
                rel="noopener noreferrer"
                className="team-member-card"
                whileHover={{
                  y: -8,
                  scale: 1.07,
                  boxShadow: '0 8px 32px 0 #833AB44a',
                  borderColor: '#FCAF45',
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="team-member-name">{teamMembers[1].name}</span>
                <span className="insta-icon" />
              </motion.a>
            </div>
            <div className="team-row">
              <motion.a
                href={teamMembers[2].url}
                target="_blank"
                rel="noopener noreferrer"
                className="team-member-card"
                whileHover={{
                  y: -8,
                  scale: 1.07,
                  boxShadow: '0 8px 32px 0 #833AB44a',
                  borderColor: '#FCAF45',
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="team-member-name">{teamMembers[2].name}</span>
                <span className="insta-icon" />
              </motion.a>
              <motion.a
                href={teamMembers[3].url}
                target="_blank"
                rel="noopener noreferrer"
                className="team-member-card"
                whileHover={{
                  y: -8,
                  scale: 1.07,
                  boxShadow: '0 8px 32px 0 #833AB44a',
                  borderColor: '#FCAF45',
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="team-member-name">{teamMembers[3].name}</span>
                <span className="insta-icon" />
              </motion.a>
            </div>
            {/* <div className="team-row" style={{ justifyContent: 'center' }}>
              <motion.a
                href={teamMembers[4].url}
                target="_blank"
                rel="noopener noreferrer"
                className="team-member-card"
                whileHover={{
                  y: -8,
                  scale: 1.07,
                  boxShadow: '0 8px 32px 0 #833AB44a',
                  borderColor: '#FCAF45',
                }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ width: '65%' }}
              >
                <span className="team-member-name">{teamMembers[4].name}</span>
                <span className="insta-icon" />
              </motion.a>
            </div> */}
          </div>
        </motion.div>

        <motion.p
          className="contact-footer"
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6, duration: 0.7 }}
        >
          We’re available <span className="highlight-247">24/7</span> – don't hesitate to reach out.
        </motion.p>
      </motion.div>
    </div>
    <Footer />
    </>
  );
};

export default Contact;