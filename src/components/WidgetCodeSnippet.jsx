import React, { useState } from 'react';
import styles from '../styles/widgetCode.module.css';

const WidgetCodeSnippet = () => {
  const [copied, setCopied] = useState(false);
  
  // Get the client key from localStorage
  const clientKey = localStorage.getItem('clientKey');

  // Create the installation code that uses the correct client key
  const scriptCode = `<!-- Accessibility Widget -->
<script src="${window.location.origin}/widget/accessibility-widget.js" data-client-key="${clientKey}"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.codeSnippetContainer}>
      <h3>Widget Installation</h3>
      <p className={styles.instructions}>
        Copy and paste this code snippet just before the closing <code>&lt;/body&gt;</code> tag of your website.
      </p>
      
      <div className={styles.codeWrapper}>
        <pre className={styles.codeBlock}>
          <code>{scriptCode}</code>
        </pre>
        <button 
          className={styles.copyButton}
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>

      <div className={styles.clientKeyInfo}>
        <p><strong>Your Client Key:</strong> {clientKey}</p>
        <p>This key is unique to your account and is required for the widget to work.</p>
      </div>
    </div>
  );
};

export default WidgetCodeSnippet;
