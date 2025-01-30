import React, { useState } from 'react';
import styles from '../styles/widgetCode.module.css';

const WidgetCodeSnippet = () => {
  const [copied, setCopied] = useState(false);

  // Create widget installation code
  const scriptCode = `<!-- Accessibility Widget -->
<script>
  // Widget settings
  const supabaseUrl = "https://hkurtvvrgwlgpbyfbmup.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrdXJ0dnZyZ3dsZ3BieWZibXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTkyOTksImV4cCI6MjA1MzEzNTI5OX0.T8kS-k8XIcTzAHiX7NWQQtJ6Nkf7OFOsUYsIFAiL37o";

  // Load the widget script
  const script = document.createElement('script');
  script.src = "${window.location.origin}/widget/accessibility-widget.js";
  script.setAttribute('data-supabase-url', supabaseUrl);
  script.setAttribute('data-supabase-key', supabaseKey);
  document.body.appendChild(script);
</script>`;

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
