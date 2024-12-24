import React, { useState } from 'react';

const BiryaniCard = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '250px',
        backgroundColor: isHovered ? '#f0f8ff' : '#ffffff',
        borderRadius: '15px',
        boxShadow: isHovered 
          ? '0 15px 35px rgba(0, 0, 0, 0.15)' 
          : '0 10px 25px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif',
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)'
      }}
    >
      <img 
        src="https://res.cloudinary.com/duhabjmtf/image/upload/v1733835338/biryani_z1lxca.jpg" 
        alt="Hyderabad Dum Biryani" 
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          objectFit: 'cover',
          margin: '20px auto',
          border: '5px solid #f0f0f0',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          filter: isHovered 
            ? 'brightness(110%) saturate(120%)' 
            : 'brightness(100%) saturate(100%)'
        }}
      />
      <a 
        href="https://youtu.be/nf9tq7cNkTQ?si=iUy7OOO2Mn-HtqOY" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: isHovered ? '#ff6b00' : '#333',
          margin: '10px 0',
          textDecoration: 'none',
          display: 'block',
          transition: 'color 0.3s ease'
        }}
      >
        𝖧𝗒𝖽𝖾𝗋𝖺𝖻𝖺𝖽 𝖣𝗎𝗆 𝖡𝗂𝗋𝗒𝖺𝗇𝗂
      </a>
      <p style={{
        color: isHovered ? '#ff4500' : '#777',
        fontSize: '14px',
        marginBottom: '15px',
        transition: 'color 0.3s ease'
      }}>
        Indian
      </p>
    </div>
  );
};

export default BiryaniCard;