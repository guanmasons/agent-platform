export interface User {
    userId: string;
    username: string;
    email: string;
    firstName?: string; // Optional
    lastName?: string;  // Optional
    companyName?: string; // Optional
    createdAt: number;
    updatedAt: number;
  }