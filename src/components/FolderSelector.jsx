import React from 'react';
import { useContext } from 'react';
import { Context } from '../context/Context';
import './FolderSelector.css';
import sharkImage from '../options/tralalero_tralala.png';
import crocodileImage from '../options/bombardino_crocodilo.png';

const FolderSelector = () => {
    const { selectedFolder, setSelectedFolder } = useContext(Context);

    const handleFolderChange = (e) => {
        setSelectedFolder(e.target.value);
    };

    return (
        <div className="folder-selector">
            <div className="folder-options">
                <div 
                    className={`folder-option ${selectedFolder === 'Tralalero tralala' ? 'selected' : ''}`}
                    onClick={() => setSelectedFolder('Tralalero tralala')}
                >
                    <img src={sharkImage} alt="Tralalero tralala" />
                    <span>Tralalero Tralala</span>
                </div>
                <div 
                    className={`folder-option ${selectedFolder === 'Bombardino Crocodilo' ? 'selected' : ''}`}
                    onClick={() => setSelectedFolder('Bombardino Crocodilo')}
                >
                    <img src={crocodileImage} alt="Bombardino Crocodilo" />
                    <span>Bombardino Crocodilo</span>
                </div>
            </div>
        </div>
    );
};

export default FolderSelector; 