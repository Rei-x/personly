"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

const formSchema = z.object({
  name: z.string().nonempty(),
});

function NewPerson() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const router = useRouter();

  const addPerson = api.person.add.useMutation();

  const onSubmit = form.handleSubmit(async (data) => {
    await addPerson.mutateAsync(data);
    router.push("/");
    form.reset();
  });

  return (
    <div className="mx-2">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Person name</FormLabel>
                <FormControl>
                  <Input placeholder="Bartosz Gotowski" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button loading={form.formState.isSubmitting} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default NewPerson;
