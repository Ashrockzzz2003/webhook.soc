"use client";

import { SessionProvider } from "next-auth/react";

const ClientSessionWrapper = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ClientSessionWrapper;
