import React, { createContext, useState } from 'react';
import OpenAI from 'openai';
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

    // Initialize OpenAI client
    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Required for browser usage
    });

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
            console.log('Generating image with prompt:', prompt);
            
            const result = await openai.images.generate({
                model: "gpt-image-1",
                prompt: prompt,
                n: 1,
                quality: "low",
                size: "1024x1024"
            });

            console.log('API Response:', result);

            if (result.data && result.data[0] && result.data[0].b64_json) {
                // Convert base64 to data URL for display
                const imageUrl = `data:image/png;base64,${result.data[0].b64_json}`;
                console.log('Image generated successfully');
                setImageUrl(imageUrl);
                return imageUrl;
            } else {
                console.error('Invalid response format:', result);
                throw new Error('Invalid response format from API');
            }
        } catch (error) {
            console.error('Error in imageGenerator:', error);
            setResultData(`Error: ${error.message}`);
            return null;
        }
    }

    const onSent = async (prompt) => {
        try {
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
                setResultData("Failed to generate image. Please check the console for details.");
            }
        } catch (error) {
            console.error('Error in onSent:', error);
            setResultData(`Error: ${error.message}`);
        } finally {
            setLoading(false)
            setInput("")
        }
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