import React, { useState } from 'react';
import styles from '../styles/widgetCode.module.css';

const WidgetCodeSnippet = () => {
  const [copied, setCopied] = useState(false);
  const settings = JSON.parse(localStorage.getItem('widgetSettings') || '{}');

  // Create the script tag with proper HTML encoding for quotes
  const scriptCode = `<!-- Accessibility Widget -->
<script 
  src="${window.location.origin}/widget/accessibility-widget.js"
  data-header-color="${settings.headerColor || '#60a5fa'}"
  data-header-text-color="${settings.headerTextColor || '#1e293b'}"
  data-button-color="${settings.buttonColor || '#2563eb'}"
  data-powered-by-text="${settings.poweredByText || 'Powered by Accessibility Widget'}"
  data-powered-by-color="${settings.poweredByColor || '#64748b'}"
  async
  defer
></script>`;

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
    </div>
  );
};

export default WidgetCodeSnippet;
