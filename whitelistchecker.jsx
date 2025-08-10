import React, { useState, useEffect } from 'react';

// --- STYLING ---
// NOTE: Add the paths to your CSS files here.
// The first is for this specific page, the second is for your site's global styles.
import './WhitelistPage.css';
import '../styles/GlobalStyles.css'; // Example: your main CSS file

// --- DATA & TRANSLATIONS ---
// NOTE: Fill these arrays with your project's data.

const acceptedWalletsData = [
    // Add your ACCEPTED wallets here
    { wallet: '0x1111111111111111111111111111111111111111', twitter: '@example_winner_1' },
    { wallet: '0x2222222222222222222222222222222222222222', twitter: '@example_winner_2' },
];

const rejectedWalletsData = [
    // Add your REJECTED wallets here
    { wallet: '0x3333333333333333333333333333333333333333', reason: 'Example reason: Bot activity detected.' },
    { wallet: '0x4444444444444444444444444444444444444444', reason: 'Example reason: Social media tasks not completed.' },
];

const translations = {
    // NOTE: Add all your language translations here.
    // The 'en' object is required as a fallback.
    en: {
        presaleLive: "PRESALE APPLICATIONS ARE LIVE!",
        pageTitle: "Whitelist Results",
        acceptedWallets: "Accepted Wallets",
        rejectedWallets: "Rejected Wallets",
        infoTitle: "Whitelist Application",
        infoWelcome: "Welcome to the Whitelist Application! Complete the tasks below to secure your exclusive whitelist spot.",
        important: "Important:",
        task1: "Only one entry per user/wallet is allowed.",
        task2: "If multiple wallets belonging to the same user are detected, they may lose their privileges.",
        guaranteeTitle: "How to Guarantee Your Spot?",
        guaranteeText: "To significantly increase your chances of being whitelisted, please ensure that you:",
        socialTask1: "Join our official Telegram channel.",
        socialTask2: "Follow our Twitter account.",
        socialTask3: "Like and Retweet our pinned tweet.",
        formLinkTitle: "Whitelist applications are still open. To apply:",
        formLinkButton: "Go to Application Form",
        placeholder: "Enter your BSC wallet address...",
        checkButton: "Check Wallet",
        showApproved: "Show Approved List",
        hideApproved: "Hide Approved List",
        showRejected: "Show Rejected List",
        hideRejected: "Hide Rejected List",
        colAcceptedWallet: "Accepted Wallet Address",
        colTwitter: "Twitter",
        colRejectedWallet: "Rejected Wallet Address",
        colReason: "Reason for Rejection",
        msgEnterWallet: "Please enter a BSC wallet address.",
        msgInvalidFormat: "This is not a valid BSC wallet address format.",
        msgApproved: "Congratulations! Your wallet has been APPROVED for the whitelist.",
        msgNotApproved: "Sorry, your wallet was NOT APPROVED.",
        msgNotFound: "This wallet address was not found in the application lists.",
        reason: "Reason:",
        languageSelector: "Language:",
        promoTitle: "TRUE WIN-WIN!",
        promoText: "Get special rewards for participating! Terms and conditions apply.",
    },
    // Example for another language
    es: {
        presaleLive: "¡LAS SOLICITUDES ESTÁN ABIERTAS!",
        pageTitle: "Resultados de la Whitelist",
        // ... add full translation for Spanish ...
    },
};

// --- HELPER FUNCTIONS ---
const isValidBscAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address);

// This function masks the middle of a string with asterisks for privacy
const maskTwitter = (handle) => {
    if (!handle || handle.length <= 4) return handle;
    return `${handle.substring(0, 3)}****${handle.substring(handle.length - 2)}`;
};

// --- MAIN COMPONENT ---
const WhitelistCheckPage = () => {
    const [walletInput, setWalletInput] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isAcceptedListVisible, setIsAcceptedListVisible] = useState(false);
    const [isRejectedListVisible, setIsRejectedListVisible] = useState(false);
    const [language, setLanguage] = useState('en');

    // Automatically detect user's browser language on first load
    useEffect(() => {
        const userLang = navigator.language || navigator.userLanguage;
        const shortLang = userLang.split('-')[0];
        if (translations[shortLang]) {
            setLanguage(shortLang);
        }
    }, []);

    // Set the current language text, fallback to English if not found
    const t = translations[language] || translations['en'];

    // Logic to check the wallet against the data arrays
    const handleCheckWallet = () => {
        const address = walletInput.trim();
        if (!address) {
            setMessage({ text: t.msgEnterWallet, type: 'info' });
            return;
        }
        if (!isValidBscAddress(address)) {
            setMessage({ text: t.msgInvalidFormat, type: 'error' });
            return;
        }

        const accepted = acceptedWalletsData.find(w => w.wallet.toLowerCase() === address.toLowerCase());
        if (accepted) {
            setMessage({ text: `${t.msgApproved} (Twitter: ${maskTwitter(accepted.twitter)})`, type: 'success' });
            return;
        }

        const rejected = rejectedWalletsData.find(w => w.wallet.toLowerCase() === address.toLowerCase());
        if (rejected) {
            setMessage({ text: `${t.msgNotApproved} ${t.reason} ${rejected.reason}`, type: 'error' });
            return;
        }

        setMessage({ text: t.msgNotFound, type: 'info' });
    };

    return (
        <div className={`whitelist-container ${language === 'ar' || language === 'fa' ? 'rtl' : ''}`}>
            <div className="presale-banner">
                <span className="live-dot"></span> {t.presaleLive}
            </div>

            <div className="language-selector-container">
                <label htmlFor="language-select">{t.languageSelector}</label>
                <select id="language-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    {/* NOTE: Add an <option> tag for each language key in your translations object */}
                    <option value="en">English</option>
                    <option value="es">Español</option>
                </select>
            </div>

            <header className="page-header">
                <h1 className="hero-title">YourProject <span>{t.pageTitle}</span></h1>
            </header>

            <div className="stats-container">
                <div className="stat-item stat-accepted">
                    <div className="stat-number">{acceptedWalletsData.length}</div>
                    <div className="stat-label">{t.acceptedWallets}</div>
                </div>
                <div className="stat-item stat-rejected">
                    <div className="stat-number">{rejectedWalletsData.length}</div>
                    <div className="stat-label">{t.rejectedWallets}</div>
                </div>
            </div>

            <div className="application-info-box">
                <h4 className="info-title-gradient">{t.infoTitle}</h4>
                <p>{t.infoWelcome}</p>
                <h4><span className="icon">⚠️</span>{t.important}</h4>
                <ul>
                    <li><span className="icon">➡️</span>{t.task1}</li>
                    <li><span className="icon">➡️</span><span className="warning-text">{t.task2}</span></li>
                </ul>
                <h4><span className="icon">🛡️</span>{t.guaranteeTitle}</h4>
                <p>{t.guaranteeText}</p>
                <ul>
                    <li><span className="icon">✅</span>{t.socialTask1}</li>
                    <li><span className="icon">✅</span>{t.socialTask2}</li>
                    <li><span className="icon">✅</span>{t.socialTask3}</li>
                </ul>
            </div>

            <div className="whitelist-link-container">
                <p className="whitelist-link-text">{t.formLinkTitle}</p>
                {/* NOTE: Replace this with your actual application form link */}
                <a href="https://your-form-link-here.com" target="_blank" rel="noopener noreferrer" className="cta-button form-link">
                    {t.formLinkButton}
                </a>
            </div>

            <section className="check-section">
                <div className="input-group">
                    <input
                        type="text"
                        id="wallet-input"
                        placeholder={t.placeholder}
                        value={walletInput}
                        onChange={(e) => setWalletInput(e.target.value)}
                    />
                    <button id="check-wallet-btn" className="cta-button" onClick={handleCheckWallet}>{t.checkButton}</button>
                </div>
                {message.text && (
                    <div className={`message-box ${message.type}`}>{message.text}</div>
                )}
            </section>

            <section className="list-section">
                <button className="cta-button" onClick={() => setIsAcceptedListVisible(!isAcceptedListVisible)}>
                    {isAcceptedListVisible ? t.hideApproved : t.showApproved}
                </button>
                {isAcceptedListVisible && (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t.colAcceptedWallet}</th>
                                    <th>{t.colTwitter}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {acceptedWalletsData.map((winner) => (
                                    <tr key={winner.wallet}>
                                        <td>{winner.wallet}</td>
                                        <td>{maskTwitter(winner.twitter)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="list-section">
                <button className="cta-button danger" onClick={() => setIsRejectedListVisible(!isRejectedListVisible)}>
                    {isRejectedListVisible ? t.hideRejected : t.showRejected}
                </button>
                {isRejectedListVisible && (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t.colRejectedWallet}</th>
                                    <th>{t.colReason}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rejectedWalletsData.map((rejected) => (
                                    <tr key={rejected.wallet}>
                                        <td>{rejected.wallet}</td>
                                        <td>{rejected.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
            
            <div className="promo-box">
                <h4 className="promo-title">{t.promoTitle}</h4>
                <p className="promo-text">{t.promoText}</p>
            </div>
        </div>
    );
};

export default WhitelistCheckPage;