import React, { useState } from 'react';
import styles from '../styles/widgetCode.module.css';

const WidgetCodeSnippet = ({ scriptKey }) => {
  const [copied, setCopied] = useState(false);
  const WIDGET_URL = localStorage.getItem('widgetDomain') || window.location.origin;

  const scriptCode = `<!-- Accessibility Widget -->
<script 
  src="${WIDGET_URL}/widget/accessibility-widget.js"
  data-client-key="${scriptKey}"
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
        The widget will automatically update when new changes are published.
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

      <div className={styles.notes}>
        <h4>Important Notes:</h4>
        <ul>
          <li>The widget will automatically update when you publish new changes</li>
          <li>Updates may take up to 5 minutes to propagate to all clients</li>
          <li>Your unique client key ensures proper tracking and customization</li>
          <li>The widget appears in the bottom right corner of your website</li>
        </ul>
      </div>
    </div>
  );
};

export default WidgetCodeSnippet;
