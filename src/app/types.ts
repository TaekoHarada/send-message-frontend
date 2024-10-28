// types.ts
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  latestVisitDate: string;
}

export interface MailTemplate {
  id: string;
  title: string;
  message: string;
}
