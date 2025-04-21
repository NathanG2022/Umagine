import React, { createContext, useState } from 'react';
import run from "../config/umagine"

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord);
        }, 75 * index)
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
        setImageUrl("")
    }

    const imageGenerator = async (prompt) => {
        try {
            const response = await fetch(
                "https://api.openai.com/v1/images/generations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                        "User-Agent": "Chrome"
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                        n: 1,
                        size: "512x512"
                    })
                }
            );
            const data = await response.json();
            if (data.data && data.data[0]) {
                setImageUrl(data.data[0].url);
                return data.data[0].url;
            } else {
                console.error('No image URL in response:', data);
                return null;
            }
        } catch (error) {
            console.error('Error generating image:', error);
            return null;
        }
    }

    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)
        setImageUrl("")

        const promptToUse = prompt !== undefined ? prompt : input;
        setPrevPrompts(prev => [...prev, promptToUse])
        setRecentPrompt(promptToUse)
        
        const imageUrl = await imageGenerator(promptToUse);
        if (imageUrl) {
            setResultData("Image generated successfully!");
        } else {
            setResultData("Failed to generate image. Please try again.");
        }
        
        setLoading(false)
        setInput("")
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        imageUrl
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider