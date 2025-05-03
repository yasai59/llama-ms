// leer el archivo news.json y devolverlo
import fs from 'fs';
import path from 'path';

export const getStocks = async () => {
  const filePath = path.join(__dirname, '../../available_stocks.json');
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return data;
  } catch (error) {
    console.error('Error reading stocks file:', error);
    throw new Error('Could not read news data');
  }
}