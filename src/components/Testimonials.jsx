import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import './Testimonials.css';

// --- KEYWORD LISTS ---
const positiveKeywords = [
    'terkabul', 'berhasil', 'luar biasa', 'ajaib', 'terbukti', 'dahsyat', 'mantap', 
    'rekomendasi', 'terbaik', 'spektakuler', 'mengubah hidup', 'bersyukur', 'terima kasih', 
    'manjur', 'solusi', 'tercapai', 'impian', 'harapan', 'nyata', 'keajaiban', 'positif',
    'berkah', 'rezeki', 'lunas', 'sukses', 'bahagia', 'tenang', 'damai', 'ikhlas'
];

const negativeKeywords = [
    'bohong', 'penipu', 'rugi', 'jelek', 'tidak berhasil', 'hoax',
    'palsu', 'negatif', 'buruk', 'sara', 'jangan', 'tidak', 'bukan'
];

const Testimonials = () => {
    const [allTestimonials, setAllTestimonials] = useState([]);
    const [displayedTestimonials, setDisplayedTestimonials] = useState([]);
    const [displayCount, setDisplayCount] = useState(15); // Default untuk desktop
    
    // Menentukan jumlah testimonial berdasarkan ukuran layar
    useEffect(() => {
        const updateDisplayCount = () => {
            setDisplayCount(window.innerWidth <= 768 ? 8 : 15);
        };
        
        updateDisplayCount();
        window.addEventListener('resize', updateDisplayCount);
        
        return () => window.removeEventListener('resize', updateDisplayCount);
    }, []);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const testimonialsCollection = collection(db, 'testimonials');
                const q = query(testimonialsCollection, orderBy('createdAt', 'desc'));
                const testimonialsSnapshot = await getDocs(q);
                const testimonialsList = testimonialsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAllTestimonials(testimonialsList);
            } catch (error) {
                console.error("Error fetching testimonials: ", error);
            }
        };
        fetchTestimonials();
    }, []);

    useEffect(() => {
        if (allTestimonials.length === 0) return;

        const smartSelectAndShuffle = () => {
            // 1. Filter out negative testimonials
            const filteredTestimonials = allTestimonials.filter(testimonial => {
                const feedbackText = testimonial.feedback.toLowerCase();
                return !negativeKeywords.some(keyword => feedbackText.includes(keyword));
            });

            // 2. Score the remaining testimonials
            const scoredTestimonials = filteredTestimonials.map(testimonial => {
                const feedbackText = testimonial.feedback.toLowerCase();
                let score = 0;
                positiveKeywords.forEach(keyword => {
                    if (feedbackText.includes(keyword)) {
                        score++;
                    }
                });
                return { ...testimonial, score };
            });

            // 3. Sort by score (desc) and then by date (desc)
            scoredTestimonials.sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
            });

            // 4. Shuffle and assign positions
            const topTestimonials = scoredTestimonials.slice(0, 30); // Widen the pool for variety
            const shuffled = [...topTestimonials];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            
            const positionedTestimonials = shuffled.slice(0, displayCount).map(t => {
                // Menggunakan rentang penuh untuk posisi acak (-45vw hingga 45vw dan -40vh hingga 40vh)
                const randomX = (Math.random() * 90) - 45; // Menghasilkan angka antara -45 dan 45
                const randomY = (Math.random() * 80) - 40; // Menghasilkan angka antara -40 dan 40

                return {
                    ...t,
                    randomX,
                    randomY,
                };
            });

            setDisplayedTestimonials(positionedTestimonials);
        };

        smartSelectAndShuffle();
        const intervalId = setInterval(smartSelectAndShuffle, 300000); // 5 minutes

        return () => clearInterval(intervalId);
    }, [allTestimonials]);

    return (
        <section id="testimonials" className="section testimonials-section">
            <h2 className="title">Testimoni</h2>
            <div className="testimonial-slider" style={{ '--count': displayedTestimonials.length, '--duration': '60s' }}>
                {displayedTestimonials.map((testimonial, index) => (
                    <div 
                        className="testimonial-item" 
                        key={testimonial.id} 
                        style={{
                            '--i': index + 1,
                            '--x': `${testimonial.randomX}vw`,
                            '--y': `${testimonial.randomY}vh`,
                        }}
                    >
                        <p className="feedback">"{testimonial.feedback}"</p>
                        <div className="author-info">
                            <p className="author">- {testimonial.name}</p>
                            <p className="source">({testimonial.source})</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
