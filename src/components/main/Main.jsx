import React, { useContext, useRef } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Main = () => {
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input, imageUrl } = useContext(Context)
    const inputRef = useRef(null);

    const handleImageGeneration = () => {
        if (input) {
            onSent();
        }
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
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => setInput("Generate an image of a beautiful sunset over mountains")}>
                                <p>Generate an image of a beautiful sunset over mountains</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => setInput("Create an image of a futuristic city")}>
                                <p>Create an image of a futuristic city</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => setInput("Generate an image of a magical forest")}>
                                <p>Generate an image of a magical forest</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => setInput("Create an image of a space exploration scene")}>
                                <p>Create an image of a space exploration scene</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='result'>
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
                                    ) : (
                                        <p>Error occured while generating image. Please try again.</p>
                                    )}
                                </div>
                            )}
                        </div>
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
                                onClick={handleImageGeneration} 
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