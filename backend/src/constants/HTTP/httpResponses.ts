import { AlertResponse } from './httpEnums';
import {
  ResponseOkType,
  ResponseOnlyType,
  ResponseWithMessageType,
} from './types';

export class HTTPResponse {
  public static serverError: ResponseOnlyType = (res) => {
    return res
      .status(500)
      .json({ message: 'Internal Server Error', type: AlertResponse.ERROR });
  };

  public static OK: ResponseOkType = (res, data) => {
    return res.status(200).json(data);
  };

  public static okWithMessage: ResponseWithMessageType = (
    res,
    message,
    type
  ) => {
    return res.status(200).json({ message, type });
  };

  public static notFound: ResponseWithMessageType = (res, message, type) => {
    return res.status(404).json({ message, type });
  };

  public static badRequest: ResponseWithMessageType = (res, message, type) => {
    return res.status(400).json({ message, type });
  };

  public static created: ResponseWithMessageType = (res, message, type) => {
    return res.status(201).json({ message, type });
  };
}
