import type { Request, Response } from 'express';
import Llama from '../../llama';
import { updateUser } from '../db/database';

export const updateHandler = async (req: Request, res: Response) => {
  const llama = new Llama();
  // creamos un nuevo usuario con el id que nos mandan y si ya existia, lo eliminamos
  // y lo volvemos a crear con el nuevo perfil
  const user = {
    id: req.query.id as string, 
    profile: JSON.stringify(req.body.profile)
  }
    updateUser(user);  

    const risk_score = await llama.getRiskScore(user.profile);
    const financial_score = await llama.getFinancialMark(user.profile)

    res.status(200).json({ risk_score, financial_score });
    return;

};