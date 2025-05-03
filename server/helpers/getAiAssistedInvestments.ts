import type { Request, Response } from 'express';
import UserSchema from '../models/User.schema';
import Llama from '../../llama';
import { getUser } from '../db/database';

export const getAiAssistedInvestmentsHandler = async (req: Request, res: Response) => {

  const user = getUser(req.query.id as string)
  const llama = new Llama();
  const recommendations = await llama.getInvestmentAdvice(user.profile);
  const returnval = JSON.parse(recommendations);


  res.status(200).json(returnval);
};