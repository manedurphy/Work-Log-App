import { Request } from 'express';

export type ValidateInputType = (req: Request) => boolean;
