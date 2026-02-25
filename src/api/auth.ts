// Mock Authentication API
export interface AuthResult {
  isSuccess: boolean;
  message?: string;
  accessToken?: string;
  token?: string;
  data?: any;
}

export const login = async (payload: { email: string; password?: string }): Promise<AuthResult> => {
  // Simulate API call
  console.log('API Login for:', payload.email);
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, you'd verify credentials here
      resolve({
        isSuccess: true,
        accessToken: 'dummy-token-' + Date.now(),
        data: {
          id: '1',
          email: payload.email,
          name: 'Admin User',
          role: 'superadmin'
        }
      });
    }, 800);
  });
};

export const grantAccess = async (payload: { email: string; fullName: string }): Promise<AuthResult> => {
  // Simulate grant-access flow
  console.log('API Grant Access for:', payload.email, payload.fullName);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isSuccess: true,
        token: 'grant-token-' + Date.now(),
        data: {
          id: '2',
          email: payload.email,
          name: payload.fullName,
          role: 'admin'
        }
      });
    }, 800);
  });
};

export const logout = async (): Promise<AuthResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ isSuccess: true });
    }, 300);
  });
};
