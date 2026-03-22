// shared/types/auth.d.ts
declare module '#auth-utils' {
  interface User {
    id:number;
    name:string;
    email:string
  }

  interface UserSession {
    user: User;
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export { }

