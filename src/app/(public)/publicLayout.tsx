import { ReactNode } from "react";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
        <h1>Public route</h1>
        {children}
    </div>
  );
}

export default PublicLayout;