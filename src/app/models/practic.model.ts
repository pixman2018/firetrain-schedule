export interface I_Practic {
  id?: string;
  category: string;
  name: string;
}

export interface I_PracticForm extends I_Practic {
  createdAt: number;
  updatedAt: number;
}
