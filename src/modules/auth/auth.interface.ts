export type TRegisterInput = {
  email: string;
  password: string;
  name: string;
  referralCode?: string;
};

export type TLoginInput = {
  email: string;
  password: string;
};

export type TAuthResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    referralCode: string;
    totalCredits: number;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};
