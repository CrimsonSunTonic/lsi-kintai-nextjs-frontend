import { ReactNode } from "react";
import ProtectedLayout from "./protectedLayout";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}

export default AppLayout;