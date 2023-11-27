import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
 //set up eslint manually every time we create new vite app:
//"npm i eslint vite-plugin-eslint eslint-config-react-app --save-dev"
//manually create ".eslintrc.json" ? necess when .eslintrc.cjs already included?
//insert: '{
//     "extends": "react-app"
// }'
// in json file
//nav to vite.config.js
//THEN
//change 'plugins: [react()]' to 'plugins: [react(), eslint()]'
//AND
//add 'import eslint from "vite-plugin-eslint"' at top