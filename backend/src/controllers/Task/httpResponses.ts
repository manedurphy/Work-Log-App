import { Response } from 'express';

export class HTTPResponses {
  public static serverError(res: Response): Response {
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  public static OK(res: Response, data: object): Response {
    return res.status(200).json(data);
  }

  public static notFound(res: Response, message: string): Response {
    return res.status(404).json({ message });
  }

  public static badRequest(res: Response, message: string): Response {
    return res.status(400).json({ message });
  }

  public static created(res: Response, message: string): Response {
    return res.status(201).json({ message });
  }
}
