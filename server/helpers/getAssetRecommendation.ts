import type { Request, Response } from 'express';
import UserSchema from '../models/User.schema';
import Llama from '../../llama';
import { getNews } from './getNews';
import { getUser } from '../db/database';

export const getAssetRecommendationHandler = async (req: Request, res: Response) => {
  // nos mandan el id del usuario y lo tenemos que buscar en la base de datos
  // si no lo encontramos, devolvemos un error
  const user = getUser(req.query.id as string)
  const product = req.query.symbol as string;

  const llama = new Llama();
  const recommendation = await llama.getAssetRecommendation(user.profile, await getNews(product));

  res.status(200).json(recommendation);

};