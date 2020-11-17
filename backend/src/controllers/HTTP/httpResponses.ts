import {
  ResponseOkType,
  ResponseOnlyType,
  ResponseWithMessagetype,
} from './types';

export class HTTPResponse {
  public static serverError: ResponseOnlyType = (res) => {
    return res.status(500).json({ message: 'Internal Server Error' });
  };

  public static OK: ResponseOkType = (res, data) => {
    return res.status(200).json(data);
  };

  public static notFound: ResponseWithMessagetype = (res, message) => {
    return res.status(404).json({ message });
  };

  public static badRequest: ResponseWithMessagetype = (res, message) => {
    return res.status(400).json({ message });
  };

  public static created: ResponseWithMessagetype = (res, message) => {
    return res.status(201).json({ message });
  };
}
