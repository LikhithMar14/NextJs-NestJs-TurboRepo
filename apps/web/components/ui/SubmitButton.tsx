import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubmitButton({ isPending }: { isPending: boolean }) {
    return (
      <Button
        disabled={isPending}
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium flex items-center justify-center space-x-2 dark:bg-green-700 dark:hover:bg-green-800"
      >
        {isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
        <span>{isPending ? "Signing up..." : "SignUp"}</span>
      </Button>
    );
}