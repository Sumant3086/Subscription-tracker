import {config} from 'dotenv';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({path: join(__dirname, '..', `.env.${process.env.NODE_ENV || 'development'}.local`)});

export const {PORT = 3000, NODE_ENV} = process.env;