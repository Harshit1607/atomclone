"use client";

import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChatWidget } from './ChatWidget';
import { StoreProvider } from '@/store/StoreProvider';

class ProtoAIWidget extends HTMLElement {
  private root: ReactDOM.Root | null = null;

  static get observedAttributes() {
    return ['api-key'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.root?.unmount();
  }

  private render() {
    console.log("ProtoAI Web Component Rendering...", { apiKey: this.getAttribute('api-key') });
    if (!this.root) {
      const mountPoint = document.createElement('div');
      mountPoint.id = 'protoai-root';
      
      // Inject global styles into shadow DOM
      // In a real production build, we would fetch the actual bundled CSS
      // For now, we'll assume the host page might provide styles or we inject a placeholder
      const shadow = this.attachShadow({ mode: 'open' });
      
      // Basic reset for shadow DOM
      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: block;
          position: fixed;
          bottom: 0;
          right: 0;
          z-index: 9999;
        }
        #protoai-root {
          width: fit-content;
          height: fit-content;
          pointer-events: auto;
        }
      `;
      // Inherit styles from the host page
      const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
      styles.forEach(s => shadow.appendChild(s.cloneNode(true)));
      
      shadow.appendChild(mountPoint);
      
      this.root = ReactDOM.createRoot(mountPoint);
    }

    const apiKey = this.getAttribute('api-key') || undefined;

    this.root.render(
      <StoreProvider>
        <ChatWidget apiKey={apiKey} />
      </StoreProvider>
    );
  }
}

if (typeof window !== 'undefined' && !customElements.get('proto-ai-widget')) {
  customElements.define('proto-ai-widget', ProtoAIWidget);
}
