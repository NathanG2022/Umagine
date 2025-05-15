import React, { useContext, useRef, useState } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import FolderSelector from '../FolderSelector'
import sharkImage from '../../options/tralalero_tralala.png';
import crocodileImage from '../../options/bombardino_crocodilo.png';

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, imageUrl, selectedFolder } = useContext(Context)
    const inputRef = useRef(null);
    const [showFolderSelector, setShowFolderSelector] = useState(false);

    const handleImageGeneration = () => {
        if (input) {
            onSent();
        }
    };

    const toggleFolderSelector = () => {
        setShowFolderSelector(prev => !prev);
    };

    return (
        <div className='main'>
            <div className="nav">
                <p>Umagine</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                {!showResult ? (
                    <>
                        <div className="greet">
                            <p><span>Hello, Nathan.</span></p>
                            <p>Select an image to edit:</p>
                        </div>
                        <FolderSelector direction="horizontal" />
                    </>
                ) : (
                    <div className='result'>
                        <div className="result-content">
                            <div className="result-title">
                                <img src={assets.user_icon} alt="" />
                                <p>{recentPrompt}</p>
                            </div>
                            <div className="result-data">
                                <img src={assets.gemini_icon} alt="" />
                                {loading ? (
                                    <div className='loader'>
                                        <hr />
                                        <hr />
                                        <hr />
                                    </div>
                                ) : (
                                    <div className="image">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt="Generated image" />
                                        ) : selectedFolder === 'Tralalero tralala' ? (
                                            <img src={sharkImage} alt="Tralalero Tralala" />
                                        ) : (
                                            <img src={crocodileImage} alt="Bombardino Crocodilo" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        {showFolderSelector && <FolderSelector />}
                    </div>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        <input 
                            ref={inputRef}
                            onChange={(e) => setInput(e.target.value)} 
                            value={input} 
                            type="text" 
                            placeholder='Enter a prompt here' 
                        />
                        <div>
                            <img 
                                src={assets.gallery_icon} 
                                alt="" 
                                onClick={toggleFolderSelector}
                                style={{ cursor: 'pointer' }} 
                            />
                            <img src={assets.mic_icon} alt="" />
                            {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
                        </div>
                    </div>
                    <p className="bottom-info">
                        Umagine can display inaccurate info and make mistakes. Please double-check responses and use with caution.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main