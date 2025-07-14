import { Question } from "@/types/interview";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuestionCardProps {
  questionNumber: number;
  questionData: Question;
  onQuestionChange: (id: string, question: Question) => void;
  onDelete: (id: string) => void;
}

const questionCard = ({
  questionNumber,
  questionData,
  onQuestionChange,
  onDelete,
}: QuestionCardProps) => {
  return (
    <Card className="shadow-md mb-4">
      <CardContent className="p-4">
        <div className="flex flex-row justify-between items-start">
          <CardTitle className="text-lg">Question {questionNumber}</CardTitle>
          <div className="flex flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold">Depth Level:</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className={`text-xs h-7 hover:bg-indigo-800 ${
                        questionData?.follow_up_count == 1
                          ? "bg-indigo-600"
                          : "opacity-50"
                      }`}
                      onClick={() =>
                        onQuestionChange(questionData.id, {
                          ...questionData,
                          follow_up_count: 1,
                        })
                      }
                    >
                      Low
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-200">
                    <p className="text-zinc-800">Brief follow-up</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className={`text-xs h-7 hover:bg-indigo-800 ${
                        questionData?.follow_up_count == 2
                          ? "bg-indigo-600"
                          : "opacity-50"
                      }`}
                      onClick={() =>
                        onQuestionChange(questionData.id, {
                          ...questionData,
                          follow_up_count: 2,
                        })
                      }
                    >
                      Medium
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-200">
                    <p className="text-zinc-800">Moderate follow-up</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className={`text-xs h-7 hover:bg-indigo-800 ${
                        questionData?.follow_up_count == 3
                          ? "bg-indigo-600"
                          : "opacity-50"
                      }`}
                      onClick={() =>
                        onQuestionChange(questionData.id, {
                          ...questionData,
                          follow_up_count: 3,
                        })
                      }
                    >
                      High
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-200">
                    <p className="text-zinc-800">Deep follow-up</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700 hover:bg-transparent p-0"
              onClick={() => onDelete(questionData.id)}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
        <div className="flex flex-row items-center mt-4">
          <textarea
            value={questionData?.question}
            className="w-full px-3 py-2 border-2 rounded-md border-gray-400 min-h-[80px] resize-y"
            placeholder="e.g. Can you tell me about a challenging project you've worked on?"
            aria-label={`Question ${questionNumber}`}
            onChange={(e) =>
              onQuestionChange(questionData.id, {
                ...questionData,
                question: e.target.value,
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default questionCard;
