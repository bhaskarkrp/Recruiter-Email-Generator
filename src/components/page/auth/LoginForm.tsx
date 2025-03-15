import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogInIcon } from "lucide-react";
import { loginUser } from "@/lib/actions/template.actions";
import { loggedinUserId, userDetails } from "@/lib/constants";
import { Spinner } from "@/components/ui/Spinner";

export default function LoginForm({
  onSwitchToSignup,
  closeModal,
}: {
  onSwitchToSignup: () => void;
  closeModal: () => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoginProgess, setIsloginProgress] = useState<boolean>(false);

  const isButtonDisabled = useMemo(() => {
    return !(email && password);
  }, [email, password]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }

    try {
      setIsloginProgress(true);
      const user = await loginUser({ email, password });
      console.log({ loggedinuser: user });

      if (user && typeof window !== "undefined") {
        localStorage.setItem(loggedinUserId, user?.$id);
        localStorage.setItem(userDetails, JSON.stringify(user));
        closeModal();
      }
    } catch (error: any) {
      console.error("Error login user - ", error);
      setError(error?.message as string);
    } finally {
      setIsloginProgress(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-red-800">{error}</h3>
            <div>
              <label className="block mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              {isLoginProgess ? (
                <Spinner loading className="h-4 w-4" />
              ) : (
                <LogInIcon className="mr-2 h-4 w-4" />
              )}
              Login
            </Button>
          </div>
          <div className="mt-3">
            <h3 className="">
              New Here?{" "}
              <span
                className="text-blue-700 cursor-pointer"
                onClick={onSwitchToSignup}
              >
                Signup
              </span>
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
