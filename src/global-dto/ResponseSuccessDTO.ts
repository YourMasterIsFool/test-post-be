export class ResponseSuccessDTO<T> {
  message: string;
  data: T | null;
  statusCode: number;

  constructor({
    data = null,

    message = 'Successfully',
    statusCode = 200,
  }: {
    data?: T | null;
    message?: string;
    statusCode?: number;
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
