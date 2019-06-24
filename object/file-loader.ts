import fs from 'fs';

export default class Logger {
  Load(path: string): string {
    return fs.readFileSync(path, { encoding: 'UTF8' });
  }
}
