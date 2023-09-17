"use client";

import * as z from "zod";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
// import { useProModal } from "@/hooks/use-pro-modal";

// import { formSchema } from "./constants";

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

const CodePage = () => {
  const router = useRouter();
  // const proModal = useProModal();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const sendMessage = useAction(api.messages.sendMessage);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
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

      form.reset();
    } catch (error: any) {
      console.log(error);
      // if (error?.response?.status === 403) {
      //   proModal.onOpen();
      // } else {
      toast.error("Something went wrong.");
      // }
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
        title="Code Generation"
        description="Generate code using descriptive text."
        icon={Code}
        iconColor="text-fuchsia-700"
        bgColor="bg-fuchsia-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 bg-white"
            >
              <FormField
                name="text"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="Simple toggle button using react hooks."
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
                  <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="bg-black/10 rounded-lg p-1"
                          {...props}
                        />
                      ),
                    }}
                    className="text-sm overflow-hidden leading-7"
                  >
                    {message.response || ""}
                  </ReactMarkdown>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
