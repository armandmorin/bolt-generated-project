
import React, { useState, useEffect } from 'react';
import styles from '../styles/widget.module.css';

const AccessibilityWidget = ({ settings, isPreview = false }) => {
  const [isOpen, setIsOpen] = useState(isPreview);
  const [features, setFeatures] = useState({});

  const toggleWidget = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const toggleFeature = (feature, e) => {
    e.stopPropagation();
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
    handleFeature(feature, !features[feature]);
  };

  const handleFeature = (feature, isActive) => {
    switch (feature) {
      case 'readableFont':
        document.body.style.fontFamily = isActive ? 'Arial, sans-serif' : '';
        break;
      case 'readAllText':
        if (isActive) {
          const text = document.body.