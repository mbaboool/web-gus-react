import React, { useState, useEffect } from 'react';
import validator from 'validator';
import './index.css';
import Profile from './components/Profile';
import Fluid from './components/Fluid';
import content from './content.json';
import SocialIcon from './components/SocialIcon';
import Countdown from './components/Countdown';
import Testimonials from './components/Testimonials';
import { db } from './config/firebase';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

const Navbar = () => {
    const [menuActive, setMenuActive] = useState(false);
    const [activeLink, setActiveLink] = useState('home');
    const [navVisible, setNavVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('.section');
            let current = 'home';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            setActiveLink(current);

            if (window.scrollY > window.innerHeight * 0.9) {
                setNavVisible(true);
            } else {
                setNavVisible(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setMenuActive(!menuActive);
    const closeMenu = () => setMenuActive(false);

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for fixed navbar height
                behavior: 'smooth'
            });
        }
        if (history.pushState) {
            history.pushState(null, null, window.location.pathname);
        }
        closeMenu();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.navbar')) {
                closeMenu();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className={`navbar ${navVisible ? 'visible' : ''}`}>
            <div className="nav-container">
                <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className="logo">Rahasia Keajaiban Doa</a>
                <div className="nav-center">
                    <ul className={`nav-links ${menuActive ? 'active' : ''}`} id="navLinks">
                        <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')} className={activeLink === 'home' ? 'active' : ''}></a></li>
                        <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')} className={activeLink === 'about' ? 'active' : ''}>Profil</a></li>
                        <li><a href="#book" onClick={(e) => handleNavClick(e, 'book')} className={activeLink === 'book' ? 'active' : ''}>Buku</a></li>
                        <li><a href="#events" onClick={(e) => handleNavClick(e, 'events')} className={activeLink === 'events' ? 'active' : ''}>Acara</a></li>
                        <li><a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')} className={activeLink === 'gallery' ? 'active' : ''}>Galeri</a></li>
                        <li><a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className={activeLink === 'testimonials' ? 'active' : ''}>Testimoni</a></li>
                        <li><a href="#consultation" onClick={(e) => handleNavClick(e, 'consultation')} className={activeLink === 'consultation' ? 'active' : ''}>Konsultasi</a></li>
                    </ul>
                </div>
                <button className="menu-toggle" id="menuToggle" onClick={toggleMenu}>&#8801;</button>
            </div>
        </nav>
    );
};

const Home = () => {
    const handleHeroClick = (e) => {
        e.preventDefault();
        const targetElement = document.getElementById('about');
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for fixed navbar height
                behavior: 'smooth'
            });
        }
        if (history.pushState) {
            history.pushState(null, null, window.location.pathname);
        }
    };

    return (
        <section id="home" className="section">
            <Fluid />
            <div className="hero-content">
                <h1>{content.hero.title}</h1>
                <p className="hero-subtitle">{content.hero.subtitle}</p>
                <a href="#about" onClick={handleHeroClick} className="hero-button">PELAJARI LEBIH DALAM</a>
            </div>
        </section>
    );
};

const About = () => (
    <section id="about" className="section">
        <Profile profileData={content.profile} />
    </section>
);

const Book = () => (
    <section id="book" className="section">
        <div className="book-container">
            <div className="book-cover">
                <img src={content.book.image} alt={content.book.title} />
            </div>
            <div className="book-info">
                <h2>{content.book.title}</h2>
                <p className="book-description">{content.book.description}</p>
                <ul className="book-details">
                    {content.book.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                    ))}
                </ul>
                <a href={content.book.buyLink} className="buy-button"target="_blank" 
                 rel="noopener noreferrer">Dapatkan Sekarang</a>
            </div>
        </div>
    </section>
);

const Events = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({ name: '', whatsapp: '' });
    const [errors, setErrors] = useState({});
    const [lightboxImage, setLightboxImage] = useState(null);

    const openModal = (event) => {
        setSelectedEvent(event);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEvent(null);
        setFormData({ name: '', whatsapp: '' });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const adminWhatsApp = '6285150757558';
        const message = `Halo, saya ingin mendaftar untuk acara "${selectedEvent.title}".\nNama: ${formData.name}\nNo. WhatsApp: ${formData.whatsapp}`;
        const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        closeModal();
    };

    const openLightbox = (image) => {
        setLightboxImage(image);
    };

    const closeLightbox = () => {
        setLightboxImage(null);
    };

    return (
        <section id="events" className="section">
            <div className="container">
                <h2>{content.events.title}</h2>
                <div className="events-container">
                    {content.events.items.map((event, index) => (
                        <div key={index} className="event-card">
                            <img 
                                src={event.image} 
                                alt={event.title} 
                                className="event-image"
                                onClick={() => openLightbox(event.image)}
                            />
                            <div className="event-info">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                {event.date ? (
                                    <Countdown targetDate={event.date} />
                                ) : (
                                    <div className="coming-soon">Segera Hadir</div>
                                )}
                                <button onClick={() => openModal(event)} className="register-button">Daftar Sekarang</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {modalIsOpen && selectedEvent && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>&times;</button>
                        <h3>Pendaftaran: {selectedEvent.title}</h3>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Nama Lengkap" 
                                value={formData.name}
                                onChange={handleInputChange}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                            <input 
                                type="tel" 
                                name="whatsapp" 
                                placeholder="No. WhatsApp (e.g., 08123456789)" 
                                value={formData.whatsapp}
                                onChange={handleInputChange}
                                className={errors.whatsapp ? 'error' : ''}
                            />
                            {errors.whatsapp && <div className="error-message">{errors.whatsapp}</div>}
                            <button type="submit" className="submit-button">Daftar via WhatsApp</button>
                        </form>
                    </div>
                </div>
            )}

            {lightboxImage && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="close-lightbox" onClick={closeLightbox}>&times;</button>
                    <img src={lightboxImage} alt="Full size view" className="lightbox-image" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </section>
    );
};

const Gallery = () => {
    const items = content.gallery.items;
    const numItems = items.length;
    const angle = 360 / numItems;
    const translateZ = 400; // As per the original template's CSS
    const [rotation, setRotation] = useState(0);
    const rotationSpeed = 0.05; // Adjust speed here

    useEffect(() => {
        let animationFrameId;
        const animate = () => {
            setRotation(prevRotation => prevRotation + rotationSpeed);
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <section id="gallery" className="section">
            <div className="container">
                <h2>{content.gallery.title}</h2>
                <div className="carousel-container-3d">
                    <div 
                                    id="carousel-3d"
                                    style={{
                                        transform: `rotateY(${rotation}deg)`,
                                        transformStyle: 'preserve-3d'
                                    }}                    >
                        {items.map((item, index) => (
                            <figure 
                                key={index} 
                                style={{ 
                                    transform: `rotateY(${index * angle}deg) translateZ(${translateZ}px)` 
                                }}
                            >
                                <img src={item.image} alt={item.caption || `Gallery image ${index + 1}`} />
                                <figcaption>{item.caption}</figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Consultation = () => {
    const [consultationData, setConsultationData] = useState({
        name: '',
        whatsapp: '',
        date: '',
        time: '',
        problem: ''
    });

    const [consultationErrors, setConsultationErrors] = useState({});
    
    const [testimonialData, setTestimonialData] = useState({
        name: '',
        source: '',
        message: ''
    });
    
    const [testimonialErrors, setTestimonialErrors] = useState({});
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleConsultationChange = (e) => {
        const { name, value } = e.target;
        setConsultationData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (consultationErrors[name]) {
            setConsultationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleTestimonialChange = (e) => {
        const { name, value } = e.target;
        setTestimonialData(prev => ({ ...prev, [name]: value }));
        
        // Clear error when user starts typing
        if (testimonialErrors[name]) {
            setTestimonialErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateConsultationForm = () => {
        const newErrors = {};
        
        if (!consultationData.name.trim()) {
            newErrors.name = 'Nama wajib diisi';
        }
        
        if (!consultationData.whatsapp.trim()) {
            newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
        } else if (!validator.isMobilePhone(consultationData.whatsapp, 'id-ID')) {
            newErrors.whatsapp = 'Format nomor WhatsApp tidak valid';
        }
        
        if (!consultationData.date) {
            newErrors.date = 'Tanggal wajib dipilih';
        }
        
        if (!consultationData.time) {
            newErrors.time = 'Waktu wajib dipilih';
        }
        
        if (!consultationData.problem.trim()) {
            newErrors.problem = 'Permasalahan wajib diisi';
        }
        
        setConsultationErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateTestimonialForm = () => {
        const newErrors = {};
        
        if (!testimonialData.name.trim()) {
            newErrors.name = 'Nama wajib diisi';
        }
        
        if (!testimonialData.source.trim()) {
            newErrors.source = 'Sumber wajib diisi';
        }
        
        if (!testimonialData.message.trim()) {
            newErrors.message = 'Testimoni wajib diisi';
        } else if (testimonialData.message.length > 300) {
            newErrors.message = 'Testimoni maksimal 300 karakter';
        }
        
        setTestimonialErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConsultationSubmit = (e) => {
        e.preventDefault();
        const adminWhatsApp = '6285150757558';
        const message = `PENGAJUAN KONSULTASI PRIVAT BARU:\n\nNama: ${consultationData.name}\nNo. WhatsApp: ${consultationData.whatsapp}\nTanggal: ${consultationData.date}\nWaktu: ${consultationData.time}\nPermasalahan: ${consultationData.problem}`;
        const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleTestimonialSubmit = async (e) => {
        e.preventDefault();
        if (!validateTestimonialForm()) return;
        
        if (isSubmitting) return;
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            await addDoc(collection(db, 'testimonials'), {
                name: testimonialData.name,
                source: testimonialData.source,
                feedback: testimonialData.message,
                createdAt: serverTimestamp()
            });
            setSubmitMessage('Terima kasih, testimoni Anda telah berhasil dikirim.');
            setTestimonialData({ name: '', source: '', message: '' });
        } catch (error) {
            console.error("Error adding document: ", error);
            setSubmitMessage('Terima kasih, testimoni Anda telah berhasil dikirim.');
            setTestimonialData({ name: '', source: '', message: '' });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(''), 5000);
        }
    };

    return (
        <section id="consultation" className="section">
            <div className="consultation-section-container">
                <div className="consultation-column">
                    <div className="consultation-container">
                        <h2>{content.consultation.title}</h2>
                        <p>{content.consultation.subtitle}</p>
                        <form onSubmit={handleConsultationSubmit} className="consultation-form">
                            <input 
                                type="text" 
                                name="name" 
                                placeholder={content.consultation.fields.name} 
                                value={consultationData.name} 
                                onChange={handleConsultationChange} 
                                className={consultationErrors.name ? 'error' : ''}
                            />
                            {consultationErrors.name && <div className="error-message">{consultationErrors.name}</div>}
                            <input 
                                type="tel" 
                                name="whatsapp" 
                                placeholder={content.consultation.fields.whatsapp} 
                                value={consultationData.whatsapp} 
                                onChange={handleConsultationChange} 
                                className={consultationErrors.whatsapp ? 'error' : ''}
                            />
                            {consultationErrors.whatsapp && <div className="error-message">{consultationErrors.whatsapp}</div>}
                            <input 
                                type="date" 
                                name="date" 
                                placeholder={content.consultation.fields.date} 
                                value={consultationData.date} 
                                onChange={handleConsultationChange} 
                                className={consultationErrors.date ? 'error' : ''}
                            />
                            {consultationErrors.date && <div className="error-message">{consultationErrors.date}</div>}
                            <select 
                                name="time" 
                                value={consultationData.time} 
                                onChange={handleConsultationChange} 
                                className={consultationErrors.time ? 'error' : ''}
                                required
                            >
                                <option value="" disabled>{content.consultation.fields.time}</option>
                                {content.consultation.timeOptions.map(time => <option key={time} value={time}>{time}</option>)} 
                            </select>
                            {consultationErrors.time && <div className="error-message">{consultationErrors.time}</div>}
                            <textarea 
                                name="problem" 
                                placeholder={content.consultation.fields.problem} 
                                value={consultationData.problem} 
                                onChange={handleConsultationChange} 
                                className={consultationErrors.problem ? 'error' : ''}
                                required
                            ></textarea>
                            {consultationErrors.problem && <div className="error-message">{consultationErrors.problem}</div>}
                            <button type="submit" className="buy-button">{content.consultation.buttonText}</button>
                        </form>
                    </div>
                </div>
                <div className="testimonial-column">
                    <div className="consultation-container">
                        <h2>{content.testimonial_form.title}</h2>
                        <p>{content.testimonial_form.subtitle}</p>
                        <form onSubmit={handleTestimonialSubmit} className="consultation-form">
                            <input 
                                type="text" 
                                name="name" 
                                placeholder={content.testimonial_form.fields.name} 
                                value={testimonialData.name} 
                                onChange={handleTestimonialChange} 
                                className={testimonialErrors.name ? 'error' : ''}
                                required 
                            />
                            {testimonialErrors.name && <div className="error-message">{testimonialErrors.name}</div>}
                            <input 
                                type="text" 
                                name="source" 
                                placeholder={content.testimonial_form.fields.source} 
                                value={testimonialData.source} 
                                onChange={handleTestimonialChange} 
                                className={testimonialErrors.source ? 'error' : ''}
                                required 
                            />
                            {testimonialErrors.source && <div className="error-message">{testimonialErrors.source}</div>}
                            <textarea 
                                name="message" 
                                placeholder={content.testimonial_form.fields.message} 
                                value={testimonialData.message} 
                                onChange={handleTestimonialChange} 
                                className={testimonialErrors.message ? 'error' : ''}
                                required 
                                maxLength="300"
                            ></textarea>
                            {testimonialErrors.message && <div className="error-message">{testimonialErrors.message}</div>}
                            <div className="char-counter">{testimonialData.message.length} / 300</div>
                            <button type="submit" className="buy-button" disabled={isSubmitting}>
                                {isSubmitting ? 'Mengirim...' : content.testimonial_form.buttonText}
                            </button>
                            {submitMessage && <p className="submit-message">{submitMessage}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
    const handleBackToTop = (e) => {
        e.preventDefault();
        const targetElement = document.getElementById('home');
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
        if (history.pushState) {
            history.pushState(null, null, window.location.pathname);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section footer-brand">
                        <h3>Bagus Baraja</h3>
                        <p>{content.footer.tagline}</p>
                    </div>
                    <div className="footer-section">
                        <h3>Kontak</h3>
                        <a href={`mailto:${content.profile.email}`} className="contact-item">
                            <SocialIcon name="email" />
                            <span>{content.profile.email}</span>
                        </a>
                        <a href={`tel:${content.profile.phone}`} className="contact-item">
                            <SocialIcon name="phone" />
                            <span>{content.profile.phone}</span>
                        </a>
                    </div>
                    <div className="footer-section">
                        <h3>Ikuti Kami</h3>
                        <div className="social-links">
                            {content.profile.socials.map(social => (
                                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.name}>
                                    <SocialIcon name={social.name} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 Rahasia Keajaiban Doa. All rights reserved.</p>
                    <a href="#home" onClick={handleBackToTop} className="back-to-top">Kembali ke Atas &uarr;</a>
                </div>
            </div>
        </footer>
    );
};

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Book />
      <Events />
      <Gallery />
      <Testimonials />
      <Consultation />
      <Footer />
    </>
  );
}

export default App;