import type { Request, Response } from 'express';
import UserSchema from '../models/User.schema';
import Llama from '../../llama';
import { getUser } from '../db/database';

export const getRecommendationsHandler = async (req: Request, res: Response) => {
  // nos mandan el id del usuario y lo tenemos que buscar en la base de datos
  // si no lo encontramos, devolvemos un error
  const user = getUser(req.query.id as string)
  const llama = new Llama();
  const recommendations = await llama.getRecommendations(user.profile);
  const returnval = JSON.parse(recommendations);
  // si lo encontramos, devolvemos el perfil
  res.status(200).json(returnval)

};