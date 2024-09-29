import { useState, useEffect } from "react";
import AIChat from "@/components/AIChat";
import { Constants } from "@/Constants";
import axios from "axios";

export function AskAiPage() {
  const [aiNameId, setAiNameId] = useState<number>();
  const [aiName, setAiName] = useState<string>();

  useEffect(() => {
    const lcAiId = localStorage.getItem("aiId");
    const lcAiName = localStorage.getItem("aiName");

    if (lcAiId == "null" || lcAiId == null || lcAiId == undefined) {
      const aiId = prompt("Enter AI name:");
      if (aiId) {
        postAiID(aiId);
      } else {
        window.history.back();
      }
    } else {
      setAiNameId(Number(lcAiId));
      setAiName(lcAiName);
    }
  }, []);

  async function postAiID(aiName: string) {
    const config = {
      method: "post",
      url: Constants.API_URL + "/api/name-ai/",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      data: { name: aiName },
    };

    try {
      const response = await axios.request(config);
      console.log({ response: response.data });
      setAiNameId(response.data.id);
      setAiName(aiName);
      localStorage.setItem("aiId", response.data.id);
      localStorage.setItem("aiName", aiName);
    } catch (error) {
      console.error("Error making API request:", error);
      alert("Error making API request");
    }
  }

  return <AIChat askAi={true} aiName={aiName} aiNameId={aiNameId} />;
}
