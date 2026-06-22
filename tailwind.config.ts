import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'], theme: { extend: { colors: { brand: { 50:'#effdf8',100:'#d8f8ef',500:'#14b889',700:'#0b7f61',900:'#064838' } } } }, plugins: [] };
export default config;
