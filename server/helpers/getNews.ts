// leer el archivo news.json y devolverlo
import fs from 'fs';
import path from 'path';

export const getNews = async (product: string) => {
  const filePath = path.join(__dirname, '../../news.json');
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    const newsData = JSON.parse(data);
    // Filter the news data based on the product
    const filteredNews = newsData.filter((news: { name: string }) => news.name === product);


    return filteredNews;
  } catch (error) {
    console.error('Error reading news file:', error);
    throw new Error('Could not read news data');
  }
}