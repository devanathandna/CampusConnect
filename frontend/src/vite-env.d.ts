/// <reference types="react-scripts" />

// Create React App Environment Variables
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly REACT_APP_API_URL: string;
    readonly REACT_APP_SOCKET_URL: string;
    // Add more REACT_APP_* environment variables as needed
  }
}
