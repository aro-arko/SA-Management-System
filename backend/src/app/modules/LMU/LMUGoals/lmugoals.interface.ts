export type TGoal = {
  title: string;
  type: 'whatsapp' | 'email' | 'calling';
  completed: number;
  remaining: number;
  total: number;
};
