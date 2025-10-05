import { ReactNode } from "react";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
        <h1>Protected route</h1>
        {children}
    </div>
  );
}

export default ProtectedLayout;