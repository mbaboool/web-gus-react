import React, { useState, useEffect } from 'react';
import './index.css';
import Profile from './components/Profile';
import Fluid from './components/Fluid';
import content from './content.json';

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
                <a href="#home" className="logo">Rahasia Keajaiban Doa</a>
                <div className="nav-center">
                    <ul className={`nav-links ${menuActive ? 'active' : ''}`} id="navLinks">
                        <li><a href="#home" className={activeLink === 'home' ? 'active' : ''} onClick={closeMenu}></a></li>
                        <li><a href="#about" className={activeLink === 'about' ? 'active' : ''} onClick={closeMenu}>Profil</a></li>
                        <li><a href="#book" className={activeLink === 'book' ? 'active' : ''} onClick={closeMenu}>Buku</a></li>
                        <li><a href="#events" className={activeLink === 'events' ? 'active' : ''} onClick={closeMenu}>Acara</a></li>
                        <li><a href="#gallery" className={activeLink === 'gallery' ? 'active' : ''} onClick={closeMenu}>Galeri</a></li>
                        <li><a href="#testimonials" className={activeLink === 'testimonials' ? 'active' : ''} onClick={closeMenu}>Testimoni</a></li>
                        <li><a href="#consultation" className={activeLink === 'consultation' ? 'active' : ''} onClick={closeMenu}>Konsultasi</a></li>
                    </ul>
                </div>
                <button className="menu-toggle" id="menuToggle" onClick={toggleMenu}>☰</button>
            </div>
        </nav>
    );
};

const Home = () => (
    <section id="home" className="section">
        <Fluid />
        <div className="hero-content">
            <h1>{content.hero.title}</h1>
            <a href="#about" className="hero-button">PELAJARI LEBIH DALAM</a>
        </div>
    </section>
);

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
    const [lightboxImage, setLightboxImage] = useState(null);

    const openModal = (event) => {
        setSelectedEvent(event);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEvent(null);
        setFormData({ name: '', whatsapp: '' });
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
                                required 
                            />
                            <input 
                                type="tel" 
                                name="whatsapp" 
                                placeholder="No. WhatsApp (e.g., 08123456789)" 
                                value={formData.whatsapp}
                                onChange={handleInputChange}
                                required 
                            />
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

    return (
        <section id="gallery" className="section">
            <div className="container">
                <h2>{content.gallery.title}</h2>
                <div className="carousel-container-3d">
                    <div id="carousel-3d">
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

const Testimonials = () => (
    <section id="testimonials" className="section">
        <div className="container">
            <h2>{content.testimonials.title}</h2>
            <div className="testimonials-container">
                {content.testimonials.items.map((testimonial, index) => (
                    <div key={index} className="testimonial-card">
                        <p className="testimonial-feedback">{testimonial.feedback}</p>
                        <div className="testimonial-author">
                            <p className="testimonial-name"><strong>{testimonial.name}</strong></p>
                            <p className="testimonial-source">{testimonial.source}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Consultation = () => (
    <section id="consultation" className="section">
        <div className="consultation-container">
            <h2>{content.consultation.title}</h2>
            <p>{content.consultation.subtitle}</p>
            <form className="consultation-form">
                <input type="text" placeholder={content.consultation.fields.name} />
                <input type="text" placeholder={content.consultation.fields.whatsapp} />
                <input type="date" placeholder={content.consultation.fields.date} />
                <select defaultValue="">
                    <option value="" disabled>{content.consultation.fields.time}</option>
                    {content.consultation.timeOptions.map(time => <option key={time} value={time}>{time}</option>)} 
                </select>
                <textarea placeholder={content.consultation.fields.problem}></textarea>
                <button type="submit" className="buy-button">{content.consultation.buttonText}</button>
            </form>
        </div>
    </section>
);

const Footer = () => (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Navigasi</h3>
                    <a href="#about">Profil</a>
                    <a href="#book">Buku</a>
                    <a href="#events">Acara</a>
                </div>
                <div className="footer-section">
                    <h3>Jelajahi</h3>
                    <a href="#gallery">Galeri</a>
                    <a href="#testimonials">Testimoni</a>
                    <a href="#consultation">Konsultasi</a>
                </div>
                <div className="footer-section">
                    <h3>Connect</h3>
                    <a href={`mailto:${content.profile.email}`}>{content.profile.email}</a>
                    <a href={`tel:${content.profile.phone}`}>{content.profile.phone}</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Gus Baraja. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

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