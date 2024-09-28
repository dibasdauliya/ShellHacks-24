import { useState } from "react";
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
import { Constants } from "@/Constants";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function CreateChildren() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [content, setContent] = useState("");
  const [sex, setSex] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !dob ||
      !content ||
      !sex ||
      !username ||
      !password
    ) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Create parent
      const parentResponse = await axios.post(
        Constants.API_URL + "/api/auth/",
        {
          full_name: user?.name,
          email: user?.email,
          image: user?.picture,
        }
      );
      const parentId = parentResponse.data.id;

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: Constants.API_URL + "/api/children/",
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        //   "Content-Type": "application/json",
        // },
        data: {
          first_name: firstName,
          last_name: lastName,
          dob,
          content,
          sex,
          username,
          password,
          parent: parentId,
        },
      };

      console.log({ data: config.data });

      await axios.request(config);
      alert("Account created successfully");
      navigate("/dashboard");

      setError("");
    } catch (error) {
      console.error(error);
      setError(
        `Failed to create account: ${JSON.stringify(error.response.data)}`
      );
    }
  };

  if (!isLoading && !isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  return (
    <Card className="w-[350px] m-8 mx-auto">
      <CardHeader>
        <CardTitle>Create Children Login</CardTitle>
        <CardDescription>
          Enter the details to create your child&apos;s account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              placeholder="Enter date of birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Input
              id="content"
              type="text"
              placeholder="Enter content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sex">Sex</Label>
            <Input
              id="sex"
              type="text"
              placeholder="Enter sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
