import { FormLayout } from "@/components/user/auth/components/FormLayout";
import { SideLayout } from "@/components/user/auth/components/SideLayout";

export default function LoginPage() {

  return (
    <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <SideLayout />
      <FormLayout />
    </div>
  );
}
