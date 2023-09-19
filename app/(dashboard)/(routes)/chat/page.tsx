"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/heading";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Empty } from "@/components/ui/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import toast from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { useProModal } from "@/hooks/use-pro-modal";
import { ConvexError } from "convex/values";

const formSchema = z.object({
  text: z.string().min(1, {
    message: "Prompt is required.",
  }),
});

type MessageProps = {
  text?: string;
  response?: string | null;
  role?: string | "user";
};

const ChatPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const { user } = useUser();

  const args = {
    userId: user?.id ?? "",
    count: 1,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const sendMessage = useAction(api.messages.sendMessage);
  const increaseApiLimit = useMutation(api.userApiLimit.increaseUserApiLimit);

  const checkApiLimit = useQuery(api.userApiLimit.checkUserApiLimit);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user) {
        return;
      }

      const freeTrial = await checkApiLimit;

      if (!freeTrial) {
        proModal.onOpen();
        return;
      }

      const response = await sendMessage({ ...values });
      const aiMessage = {
        text: values.text,
        response: response.choices[0].message.content,
        role: "ai",
      };
      const userMessage = {
        text: values.text,
        response: "",
        role: "user",
      };
      const newMessages = [...messages, aiMessage];

      const allMessages = [...newMessages, userMessage];

      setMessages(allMessages);

      await increaseApiLimit(args);

      form.reset();
    } catch (error: any) {
      console.log(error);
      toast.error("Something went wrong.");
    } finally {
      router.refresh();
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <div className="relative z-50">
      <Heading
        title="Chat"
        description="Experience the most advanced chat AI."
        icon={MessageSquare}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 bg-white"
            >
              <FormField
                name="text"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="what is the multiplication result of 2x2?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                type="submit"
                disabled={isLoading}
                size="icon"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                {message.role === "user" ? (
                  <p className="text-sm">{message.text}</p>
                ) : (
                  <p className="text-sm">{message.response}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
