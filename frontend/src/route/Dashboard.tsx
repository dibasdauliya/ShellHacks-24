import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export default function Dashboard() {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Login attempt with Google");
  }

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
          <Button type="submit" className="w-full">
            Sign in with Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
