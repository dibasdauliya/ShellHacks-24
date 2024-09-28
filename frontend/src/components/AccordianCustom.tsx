import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Quiz {
  question: string;
  answer: string;
}

export function AccordionCustom({ quizzes }: { quizzes: Quiz[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {quizzes.map((quiz, index) => {
        return (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{quiz.question}</AccordionTrigger>
            <AccordionContent>{quiz.answer}</AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
