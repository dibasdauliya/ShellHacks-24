import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import ParentDashboard from "@/components/ParentDashboard";

export default function Dashboard() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Login attempt with Google");
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <Card className="w-[350px] m-8 mx-auto">
        <CardHeader>
          <CardTitle>Parents Login</CardTitle>
          <CardDescription>
            Please sign in to access your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardFooter>
            <Button
              type="submit"
              //   @ts-ignore
              onClick={loginWithRedirect}
              className="w-full"
            >
              Sign in with Google
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  } else {
    return <ParentDashboard />;
  }
}
