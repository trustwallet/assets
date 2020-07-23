import * as fs from "fs";

export const readFileSync = (path: string) => fs.readFileSync(path, 'utf8');
export const writeFileSync = (path: string, data: any) => fs.writeFileSync(path, data);
export const readDirSync = (path: string): string[] => fs.readdirSync(path);
export const isPathExistsSync = (path: string): boolean => fs.existsSync(path);
