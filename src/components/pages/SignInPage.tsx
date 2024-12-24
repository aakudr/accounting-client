import { Card, CardContent, CardHeader } from "shared/ui/card";
import { SignInForm } from "widgets/auth";

const SignInPage = () => {
  return (
    <main className="flex items-center justify-center h-screen">
      <Card>
        <CardHeader className="text-lg font-bold">Вход в аккаунт</CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default SignInPage;
