import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { createUser } from "@/lib/actions/template.actions";
import { Spinner } from "@/components/ui/Spinner";

export default function SignupForm({
  onSwitchToLogin,
}: {
  onSwitchToLogin: () => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSignupProgress, setIsSignupProgress] = useState<boolean>(false);

  const isButtonDisabled = useMemo(() => {
    return !(name && email && password && confirmPassword);
  }, [name, email, password, confirmPassword]);

  const handleSignup = async () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill all the fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setIsSignupProgress(true);
      const user = await createUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      onSwitchToLogin();
    } catch (error: any) {
      console.error("Error creating user - ", error);
      setError(error.message as string);
    } finally {
      setIsSignupProgress(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="text-red-800">{error}</h3>
            <div>
              <label className="block mb-1">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
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
            <div>
              <label className="block mb-1">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
            <Button
              onClick={handleSignup}
              className="w-full"
              disabled={isButtonDisabled}
            >
              {isSignupProgress ? (
                <Spinner loading className="h-4 w-4" />
              ) : (
                <PlusIcon className="mr-2 h-4 w-4" />
              )}
              Signup
            </Button>
          </div>
          <div className="mt-3">
            <h3 className="">
              Already have an account?{" "}
              <span
                className="text-blue-700 cursor-pointer"
                onClick={onSwitchToLogin}
              >
                Login
              </span>
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
