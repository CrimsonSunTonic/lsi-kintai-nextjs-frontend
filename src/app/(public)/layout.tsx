import { ReactNode } from "react";
import PublicLayout from "./publicLayout";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return <PublicLayout>{children}</PublicLayout>;
}

export default AppLayout;