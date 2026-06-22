import * as React from 'react';import { cn } from '@/lib/utils';
export function Input(props:React.InputHTMLAttributes<HTMLInputElement>){return <input {...props} className={cn('w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500',props.className)}/>} 
export function Textarea(props:React.TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea {...props} className={cn('w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500',props.className)}/>}
