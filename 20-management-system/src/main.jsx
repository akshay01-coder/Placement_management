import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Beautiful Global Toast System
const style = document.createElement('style');
style.textContent = `
  #custom-toast-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
  }
  .custom-toast {
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(139, 92, 246, 0.4);
    color: #f8fafc;
    padding: 16px 24px;
    border-radius: 20px;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 15px rgba(139, 92, 246, 0.1);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 550;
    min-width: 320px;
    max-width: 450px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    pointer-events: auto;
    animation: toast-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .custom-toast.error-toast {
    border-color: rgba(239, 68, 68, 0.4);
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 15px rgba(239, 68, 68, 0.1);
  }
  .custom-toast.success-toast {
    border-color: rgba(16, 185, 129, 0.4);
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 15px rgba(16, 185, 129, 0.1);
  }
  .custom-toast-close {
    background: none;
    border: none;
    color: rgba(248, 250, 252, 0.5);
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
    line-height: 1;
    transition: all 0.2s ease;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .custom-toast-close:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
  }
  .custom-toast::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #8b5cf6, #ec4899);
    width: 100%;
    animation: toast-progress 4s linear forwards;
  }
  .custom-toast.error-toast::after {
    background: linear-gradient(90deg, #ef4444, #f97316);
  }
  .custom-toast.success-toast::after {
    background: linear-gradient(90deg, #10b981, #3b82f6);
  }
  @keyframes toast-slide-in {
    from {
      transform: translateX(120%) scale(0.9);
      opacity: 0;
    }
    to {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
  }
  @keyframes toast-slide-out {
    from {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
    to {
      transform: translateX(120%) scale(0.9);
      opacity: 0;
    }
  }
  @keyframes toast-progress {
    from { width: 100%; }
    to { width: 0%; }
  }
`;
document.head.appendChild(style);

const container = document.createElement('div');
container.id = 'custom-toast-container';
document.body.appendChild(container);

window.alert = (message) => {
  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  
  const displayMsg = typeof message === 'object' ? JSON.stringify(message) : String(message);
  
  let icon = 'ℹ️';
  if (displayMsg.toLowerCase().includes('success') || displayMsg.includes('🎉') || displayMsg.toLowerCase().includes('successfully') || displayMsg.includes('✓')) {
    icon = '✅';
    toast.classList.add('success-toast');
  } else if (displayMsg.toLowerCase().includes('fail') || displayMsg.toLowerCase().includes('error') || displayMsg.toLowerCase().includes('invalid')) {
    icon = '❌';
    toast.classList.add('error-toast');
  }
  
  toast.innerHTML = `
    <span style="font-size: 18px; line-height: 1;">${icon}</span>
    <span style="flex-grow: 1; line-height: 1.4;">${displayMsg}</span>
    <button class="custom-toast-close">✕</button>
  `;
  
  container.appendChild(toast);
  
  const closeBtn = toast.querySelector('.custom-toast-close');
  const removeToast = () => {
    toast.style.animation = 'toast-slide-out 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    setTimeout(() => {
      toast.remove();
    }, 400);
  };
  
  closeBtn.addEventListener('click', removeToast);
  setTimeout(removeToast, 4000);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)