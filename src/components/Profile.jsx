import React from 'react';
import './Profile.css';

const Bio = ({ text }) => {
    const lines = text.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (line.startsWith('*')) {
            const listItems = [];
            while (i < lines.length && lines[i].startsWith('*')) {
                listItems.push(<li key={i}>{lines[i].substring(1).trim()}</li>);
                i++;
            }
            elements.push(<ul key={`ul-${i}`}>{listItems}</ul>);
        } else if (line.trim() === '') {
            elements.push(<br key={i} />);
            i++;
        } else {
            elements.push(<p key={i}>{line}</p>);
            i++;
        }
    }

    return <div className="profile-bio">{elements}</div>;
};

function Profile({ profileData }) {
  return (
    <div className="profile-section-container-new">
      {/* New column wrapper for the left side */}
      <div className="profile-image-column">
        <h2 className="profile-column-title">PROFIL</h2>
        <img src="/images/profil.png" alt="Gus Baraja" className="profile-pic-new" />
      </div>

      {/* The right side content column */}
      <div className="profile-content-new">
        <Bio text={profileData.bio} />
        <div className="video-section">
          <h3>VIDEO TERBARU</h3>
          <div className="video-wrapper">
            <iframe 
              src={profileData.youtubeUrl} 
              title="YouTube video player" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
        <div className="cta-buttons">
          <a href="https://www.youtube.com/@BagusBaraja/videos" className="cta-button"target="_blank" 
  rel="noopener noreferrer">LIHAT SEMUA VIDEO</a>
        </div>
      </div>
    </div>
  );
}

export default Profile;
