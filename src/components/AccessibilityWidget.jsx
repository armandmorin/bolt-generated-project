import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import styles from '../styles/widget.module.css';

const AccessibilityWidget = ({ settings = {}, isPreview = false }) => {
  const [isOpen, setIsOpen] = useState(isPreview);
  const [features, setFeatures] = useState({
    readableFont: false,
    highContrast: false,
    largeText: false,
    highlightLinks: false,
    textToSpeech: false,
    dyslexiaFont: false,
    cursorHighlight: false,
    invertColors: false,
    reducedMotion: false,
    focusMode: false,
    readingGuide: false,
    monochrome: false
  });

  useEffect(() => {
    // Load saved preferences from Supabase if not in preview mode
    if (!isPreview) {
      loadUserPreferences();
    }
  }, [isPreview]);

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 means no data found
          console.error('Error loading preferences:', error);
        }
        return;
      }

      if (data?.features) {
        setFeatures(data.features);
        applyFeatures(data.features);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const saveUserPreferences = async (newFeatures) => {
    if (isPreview) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          features: newFeatures,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const toggleWidget = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleFeatureToggle = (feature) => {
    const newFeatures = {
      ...features,
      [feature]: !features[feature]
    };
    setFeatures(newFeatures);
    applyFeatures(newFeatures);
    saveUserPreferences(newFeatures);
  };

  // Rest of your existing code (applyFeatures, handleTextToSpeech, etc.)
  // ...

  return (
    <div className={styles.widgetContainer}>
      {/* Rest of your existing JSX */}
    </div>
  );
};

export default AccessibilityWidget;
