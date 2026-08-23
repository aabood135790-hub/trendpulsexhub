const fs = require('fs');

const fallback = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2394a3b8"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;

const controller = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><path d="M21.58 16.09l-1.09-7.66C20.18 6.27 18.4 5 16.32 5H7.68C5.6 5 3.82 6.27 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>`;

const shield = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310b981"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>`;

const sword = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23f43f5e"><path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-1.25 0-2.45.49-3.34 1.38l-1.3 1.3 2.83 2.83 1.3-1.3c1.85-1.85 1.85-4.86 0-6.72l-2.03-2.03c-.45-.45-1.05-.7-1.68-.7-.63 0-1.23.25-1.68.7L9.5 5.5l2.83 2.83 1.3-1.3c.49-.49.49-1.28 0-1.77-.49-.49-1.28-.49-1.77 0l-1.3 1.3-2.83-2.83 1.3-1.3C10.22 1.49 11.42 1 12.67 1c1.25 0 2.45.49 3.34 1.38L17.66 3z"/></svg>`; // Need a better sword

console.log({ fallback, controller, shield });
