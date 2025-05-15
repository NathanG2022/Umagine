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
    const [selectedFolder, setSelectedFolder] = useState("Tralalero tralala");

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
            console.log('Starting image generation...');
            console.log('Original prompt:', prompt);
            console.log('Selected folder:', selectedFolder);
            
            // Get the image file based on the selected folder
            const imagePath = selectedFolder === 'Tralalero tralala' 
                ? '/src/options/tralalero_tralala.png'
                : '/src/options/bombardino_crocodilo.png';

            console.log('Attempting to fetch image from:', imagePath);

            try {
                // Create a File object from the image
                const response = await fetch(imagePath);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
                }
                const blob = await response.blob();
                console.log('Image blob created:', blob);
                
                // Create a File object from the blob
                const file = new File([blob], "image.png", { type: "image/png" });
                
                // Create the edit prompt
                const editPrompt = `Modify this image by adding or replacing elements with: ${prompt}. Maintain the original image's style, lighting, and perspective while integrating the new elements. Keep the background and overall composition similar to the original image, but incorporate the requested changes in a way that matches the cartoony style of the base image.`;
                
                console.log('Edit prompt:', editPrompt);

                // Call the edit API
                console.log('Calling OpenAI API...');
                const result = await openai.images.edit({
                    model: "gpt-image-1",
                    image: file,
                    prompt: editPrompt,
                    n: 1,
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
            } catch (fetchError) {
                console.error('Error fetching or processing image:', fetchError);
                throw fetchError;
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
        imageUrl,
        selectedFolder,
        setSelectedFolder
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider