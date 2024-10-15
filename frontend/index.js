import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLanguage = document.getElementById('targetLanguage');
const translateBtn = document.getElementById('translateBtn');
const outputText = document.getElementById('outputText');
const speakBtn = document.getElementById('speakBtn');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

translateBtn.addEventListener('click', translateText);
speakBtn.addEventListener('click', speakTranslation);
clearHistoryBtn.addEventListener('click', clearHistory);

async function translateText() {
    const text = inputText.value;
    const lang = targetLanguage.value;
    
    if (!text) return;

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`);
        const data = await response.json();
        
        if (data.responseStatus === 200) {
            const translatedText = data.responseData.translatedText;
            outputText.textContent = translatedText;
            
            // Add translation to backend
            await backend.addTranslation(text, translatedText, lang);
            
            // Update history display
            updateHistory();
        } else {
            outputText.textContent = 'Translation failed. Please try again.';
        }
    } catch (error) {
        console.error('Translation error:', error);
        outputText.textContent = 'An error occurred. Please try again.';
    }
}

function speakTranslation() {
    const text = outputText.textContent;
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLanguage.value;
    speechSynthesis.speak(utterance);
}

async function updateHistory() {
    const translations = await backend.getTranslations();
    historyList.innerHTML = '';
    translations.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${t.original} -> ${t.translated} (${t.targetLanguage})`;
        historyList.appendChild(li);
    });
}

async function clearHistory() {
    await backend.clearTranslations();
    updateHistory();
}

// Initial history load
updateHistory();
