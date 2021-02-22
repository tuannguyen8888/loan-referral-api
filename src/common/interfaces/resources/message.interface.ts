export interface MessagesHeaders {
  priority: number;
}

export interface MessagesBody {
  phone: string;
  content: string;
  reqid: string;
  brandname: string;
}
