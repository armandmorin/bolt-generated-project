import React, { useState } from 'react';
import styles from '../styles/widgetCode.module.css';

const WidgetCodeSnippet = ({ clientKey }) => {
  const [copied, setCopied] = useState(false);

  const scriptCode = `<!-- Accessibility Widget -->
<script 
  src="${window.location.origin}/widget/accessibility-widget.js"
  data-client-key="${clientKey}"
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
