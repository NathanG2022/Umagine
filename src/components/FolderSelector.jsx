import React, { useContext, useState } from 'react';
import { Context } from '../context/Context';
import './FolderSelector.css';

const images = import.meta.glob('../options/*.png', { eager: true });

const formatLabel = (filename) => {
    return filename
        .replace(/_/g, ' ')
        .replace(/\.[^/.]+$/, '')
        .replace(/\b\w/g, c => c.toUpperCase());
};

const imageList = Object.entries(images).map(([path, mod]) => {
    const name = path.split('/').pop();
    return {
        label: formatLabel(name),
        value: name,
        src: mod.default
    };
});

const FolderSelector = () => {
    const { selectedFolder, setSelectedFolder } = useContext(Context);
    const [sliderIndex, setSliderIndex] = useState(0);
    const visibleCount = 3;

    const handlePrev = () => {
        setSliderIndex((prev) => Math.max(prev - 1, 0));
    };
    const handleNext = () => {
        setSliderIndex((prev) => Math.min(prev + 1, imageList.length - visibleCount));
    };

    const selectedIndex = imageList.findIndex(img => img.label === selectedFolder);

    const visibleImages = imageList.slice(sliderIndex, sliderIndex + visibleCount);

    return (
        <div className="folder-selector">
            <div className="slider-controls">
                <button onClick={handlePrev} disabled={sliderIndex === 0}>&lt;</button>
                <div className="folder-options slider">
                    {visibleImages.map((img, idx) => (
                        <div
                            key={img.value}
                            className={`folder-option${img.label === selectedFolder ? ' selected' : ''}`}
                            onClick={() => setSelectedFolder(img.label)}
                        >
                            <img src={img.src} alt={img.label} />
                            <span>{img.label}</span>
                        </div>
                    ))}
                </div>
                <button onClick={handleNext} disabled={sliderIndex >= imageList.length - visibleCount}>&gt;</button>
            </div>
        </div>
    );
};

export default FolderSelector; 