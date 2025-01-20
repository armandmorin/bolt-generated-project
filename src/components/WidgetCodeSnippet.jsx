import React, { useState } from 'react';
import styles from '../styles/widgetCode.module.css';

const WidgetCodeSnippet = () => {
  const [copied, setCopied] = useState(false);
  const settings = JSON.parse(localStorage.getItem('widgetSettings'));

  const scriptCode = `<!-- Accessibility Widget -->
<script 
  src="/widget/accessibility-widget.js"
  id="accessibility-widget-script"
  data-header-color="${settings?.headerColor}"
  data-header-text-color="${settings?.headerTextColor}"
  data-button-color="${settings?.buttonColor}"
  data-powered-by-text="${settings?.poweredByText}"
  data-powered-by-color="${settings?.poweredByColor}"
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
