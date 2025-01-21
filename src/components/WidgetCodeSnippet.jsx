import React, { useState } from 'react';
import styles from '../styles/widgetCode.module.css';

const WidgetCodeSnippet = ({ clientKey }) => {
  const [copied, setCopied] = useState(false);
  
  // Get the actual settings from localStorage
  const settings = JSON.parse(localStorage.getItem('widgetSettings') || '{}');

  // Create a simplified installation code that only includes the necessary script tag
  const scriptCode = `<script>
  // Accessibility Widget Settings
  window.accessibilitySettings = {
    headerColor: "${settings.headerColor || '#60a5fa'}",
    headerTextColor: "${settings.headerTextColor || '#1e293b'}",
    buttonColor: "${settings.buttonColor || '#2563eb'}",
    poweredByText: "${settings.poweredByText || 'Powered by Accessibility Widget'}",
    poweredByColor: "${settings.poweredByColor || '#64748b'}"
  };
</script>
<script src="${window.location.origin}/widget/accessibility-widget.js" async></script>`;

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
