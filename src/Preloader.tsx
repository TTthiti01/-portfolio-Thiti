import React, { useEffect, useState } from 'react';
import './Preloader.css';

interface PreloaderProps {
    onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const duration = 1400; // 1.4s responsive duration
        const intervalTime = 20;
        const totalSteps = duration / intervalTime;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep += 1;
            const rawProgress = Math.min(100, Math.floor((currentStep / totalSteps) * 100));
            
            setProgress((prev) => {
                const next = Math.max(prev, rawProgress);
                return next > 100 ? 100 : next;
            });

            if (currentStep >= totalSteps) {
                clearInterval(timer);
                setProgress(100);
                setTimeout(() => {
                    setIsFadingOut(true);
                    setTimeout(() => {
                        setIsFinished(true);
                        if (onComplete) onComplete();
                    }, 700); // 700ms top-bottom split transition
                }, 200);
            }
        }, intervalTime);

        return () => clearInterval(timer);
    }, [onComplete]);

    if (isFinished) return null;

    return (
        <div className={`preloader-overlay ${isFadingOut ? 'fade-out' : ''}`}>
            {/* Top & Bottom Split Curtain Panels */}
            <div className="curtain-panel curtain-top"></div>
            <div className="curtain-panel curtain-bottom"></div>

            {/* Central Masterclass Typography Content */}
            <div className="preloader-content">
                {/* Status Pill Badge */}
                <div className="preloader-status-pill">
                    <span className="pill-pulse-dot"></span>
                    <span className="pill-label">PORTFOLIO EXCELLENCE &bull; 2026</span>
                </div>

                {/* Circular Logo Badge */}
                <div className="logo-badge-wrapper">
                    <div className="logo-badge-core">
                        <img 
                            src="/assets/logo.png" 
                            alt="Logo" 
                            className="logo-badge-img"
                            onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                                const parent = (e.target as HTMLElement).parentElement;
                                if (parent && !parent.querySelector('.preloader-fallback-text')) {
                                    const span = document.createElement('span');
                                    span.className = 'preloader-fallback-text';
                                    span.innerText = 'TS';
                                    parent.appendChild(span);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Giant Typography Liquid Text Fill Container */}
                <div className="liquid-text-container">
                    {/* Background Outlined / Muted Text Layer */}
                    <h1 className="liquid-text text-base">THITIPONG</h1>
                    
                    {/* Foreground Liquid Filled Text Layer (Clipped by progress height) */}
                    <div 
                        className="liquid-fill-wrapper"
                        style={{ height: `${progress}%` }}
                    >
                        <h1 className="liquid-text text-fill">THITIPONG</h1>
                    </div>
                </div>

                {/* Subtitle Info */}
                <p className="preloader-subtitle-text">COMPUTER SCIENCE &amp; FRONTEND DEVELOPER</p>

                {/* Progress Track & Counter */}
                <div className="preloader-bottom-info">
                    <div className="progress-track-bg">
                        <div 
                            className="progress-track-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="counter-wrapper">
                        <span className="counter-num">{progress}</span>
                        <span className="counter-percent">%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
