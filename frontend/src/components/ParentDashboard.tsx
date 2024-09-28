import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export default function ParentDashboard() {
  const { user } = useAuth0();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <Card className="w-full max-w-md m-8">
        <CardHeader>
          <CardTitle>Welcome, {user?.name}</CardTitle>
          <CardDescription>
            You are now signed in. You can now access your children's account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-white">
          <Button onClick={() => navigate("/create-children")}>
            Create Children
          </Button>
          <Button type="button" onClick={() => navigate("/chat-monitor")}>
            Chat Monitor
          </Button>
          <Button type="button" onClick={() => navigate("/show-friends")}>
            Show Friends
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/browser-activity-log")}
          >
            Browser Activity Log
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
