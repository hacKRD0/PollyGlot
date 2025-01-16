import React, { useState } from "react";
import { HfInference } from "@huggingface/inference";
import TitleImage from "../components/TitleImage";

const Home = () => {
  const [language, setLanguage] = useState("es");
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const handleSubmit = async () => {
    console.log("Text:", text);
    console.log("Language:", language);

    const hf = new HfInference(import.meta.env.VITE_HF_TOKEN);

    const result = await hf.translation({
      model: "facebook/mbart-large-50-many-to-many-mmt",
      inputs: text,
      parameters: {
        src_lang: 'en_XX',
        tgt_lang: language,
        max_new_tokens: 150
      }
    })

    console.log(result);  

  }

  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-100">
      <div className="flex flex-col items-center w-full bg-white py-4 shadow-md">
        <TitleImage />
      </div>
      <div className="flex flex-col justify-start items-center flex-1 w-1/2 px-4">
        <div className="flex flex-col items-center w-full border border-gray-950 rounded-3xl p-4">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Text to translate
          </h2>
          <input
            type="text"
            className="w-full p-2 h-1/4 border border-gray-300 rounded-lg mb-4"
            onChange={(e) => setText(e.target.value)}
          />
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Select Language
          </h2>
          <div className="flex flex-col items-center w-full mb-4">
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="language"
                value="es_XX"
                className="mr-2"
                defaultChecked
                onChange={(e) => setLanguage(e.target.value)}
              />
              Spanish
              <img className="w-6 h-4 ml-2" src="/es-flag.png" alt="es" />
            </label>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="language"
                value="fr_XX"
                className="mr-2"
                onChange={(e) => setLanguage(e.target.value)}
              />
              French
              <img className="w-6 h-4 ml-2" src="/fr-flag.png" alt="fr" />
            </label>
            <label className="flex items-center mb-2">
              <input
                type="radio"
                name="language"
                value="ja_XX"
                className="mr-2"
                onChange={(e) => setLanguage(e.target.value)}
              />
              Japanese
              <img className="w-6 h-4 ml-2" src="/jpn-flag.png" alt="jpn" />
            </label>
          </div>
          <button 
            onClick={handleSubmit} 
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${text === '' || language === '' ? 'disabled bg-blue-300 hover:bg-blue-300' : ''}`} >
            Translate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
