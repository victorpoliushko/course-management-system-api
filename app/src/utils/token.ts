// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import constants from '../config/constants';
// import { UserModel } from '../models/user';

// export async function decodeUser(token: string): Promise<UserModel | Response> {
//     if (!token) {
//       return res.status(401).json({ error: 'Authentication token not found' });
//     }

//     const decodedToken = jwt.verify(token, constants.sessionSecret) as { id: string };
//     const userId = decodedToken.id;

//     const user = await UserModel.findByPk(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     return user;
// }
