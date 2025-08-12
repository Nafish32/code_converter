import React, { useState } from 'react';
import './App.css';

function App() {
    const [sourceCode, setSourceCode] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('Java');
    const [convertedCode, setConvertedCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const languages = [
        'C', 'Java', 'Python', 'Rust', 'Go', 'JavaScript', 'Ruby', 'C#', 'C++', 'PHP'
    ];

    const handleConvert = async () => {
        setIsLoading(true);
        setConvertedCode('');

        try {
            const response = await fetch('/api/v1/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sourceCode, targetLanguage }),
            });

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const data = await response.text();
            // Remove markdown code block delimiters if present
            const cleanedCode = data.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim();
            setConvertedCode(cleanedCode);
        } catch (error) {
            console.error('Error:', error);
            setConvertedCode('Error: Could not convert code.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Code Converter</h1>
            </header>
            <main>
                <div className="converter-container">
                    <div className="code-editor">
                        <h2>Source Code</h2>
                        <textarea
                            value={sourceCode}
                            onChange={(e) => setSourceCode(e.target.value)}
                            placeholder="Enter your code here..."
                        />
                    </div>
                    <div className="controls">
                        <select
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                        >
                            {languages.map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleConvert} disabled={isLoading}>
                            {isLoading ? 'Converting...' : 'Convert'}
                        </button>
                    </div>
                    <div className="code-editor">
                        <h2>Converted Code</h2>
                        <textarea
                            value={convertedCode}
                            readOnly
                            placeholder="Converted code will appear here..."
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;