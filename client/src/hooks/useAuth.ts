// import { useEffect, useState } from "react";
// import * as auth from "../services/auth";

export { useAuthContext as useAuth } from "./useAuthContext";

// export function useAuth() {
//   const [user, setUser] = useState<auth.User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     (async () => {
//       const stored = localStorage.getItem("token");
//       if (!stored) {
//         if (isMounted) setLoading(false);
//         return;
//       }

//       try {
//         const me = await auth.fetchMe(stored);
//         if (!isMounted) return;

//         setUser(me);
//         setToken(stored);
//       } catch {
//         localStorage.removeItem("token");
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const login = async (email: string, password: string) => {
//     const { access_token } = await auth.login(email, password);
//     localStorage.setItem("token", access_token);
//     setToken(access_token);
//     const me = await auth.fetchMe(access_token);
//     setUser(me);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     setToken(null);
//   };

//   return { user, token, login, logout, loading };
// }
