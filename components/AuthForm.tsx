'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { createAccount, signInUser } from '@/lib/actions/user.actions';
const OtpModal = dynamic(() => import('@/components/OTPModal'), { ssr: false });

type FormType = 'sign-in' | 'sign-up';

const FIELD =
  'h-11 rounded-lg border-border bg-card px-3.5 text-[14.5px] shadow-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus-visible:border-vault-600/60 focus-visible:ring-4 focus-visible:ring-vault-600/10 dark:focus-visible:border-vault-400/60 dark:focus-visible:ring-vault-400/10';

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === 'sign-up'
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [accountId, setAccountId] = useState<string | null>(null);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const user =
        type === 'sign-up'
          ? await createAccount({
              fullName: values.fullName || '',
              email: values.email,
            })
          : await signInUser({ email: values.email });

      if (user?.error) {
        setErrorMessage(user.error);
        return;
      }

      setAccountId(user.accountId);
    } catch {
      if (type === 'sign-up') {
        setErrorMessage('Failed to create account. Please try again.');
      } else {
        setErrorMessage('Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isSignIn = type === 'sign-in';

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col"
          noValidate
        >
          <p className="cvl-eyebrow">
            {isSignIn ? 'Welcome back' : 'New vault'}
          </p>
          <h1 className="mt-3 font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.035em] text-foreground">
            {isSignIn ? 'Sign in to CloudVault' : 'Create your vault'}
          </h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-muted-foreground">
            {isSignIn
              ? 'Enter your email and we will send you a six-digit code. No password needed.'
              : 'Your vault starts with 2 GB of storage. We will email you a code to confirm it is you.'}
          </p>

          <div className="mt-8 space-y-4">
            {type === 'sign-up' && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[13px] font-medium text-foreground">
                      Full name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        autoComplete="name"
                        className={FIELD}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[12.5px]" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <FormLabel className="text-[13px] font-medium text-foreground">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      className={FIELD}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[12.5px]" />
                </FormItem>
              )}
            />
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="cvl-shake mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/[0.06] px-3 py-2.5 text-[13px] text-destructive"
            >
              <AlertCircle className="mt-px size-4 shrink-0" aria-hidden />
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="cvl-btn mt-6 h-11 w-full gap-2 rounded-lg text-[14.5px] font-medium hover:bg-foreground disabled:opacity-70"
          >
            <span className="shine" aria-hidden />
            {isSignIn ? 'Sign in' : 'Sign up'}
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <ArrowRight className="size-4" aria-hidden />
            )}
          </Button>

          <p className="mt-8 border-t border-border pt-6 text-center text-[13.5px] text-muted-foreground">
            {isSignIn ? 'New to CloudVault?' : 'Already have a vault?'}{' '}
            <Link
              href={isSignIn ? '/sign-up' : '/sign-in'}
              className="cvl-accent font-medium underline-offset-4 hover:underline"
            >
              {isSignIn ? 'Create an account' : 'Sign in instead'}
            </Link>
          </p>
        </form>
      </Form>

      {accountId && (
        <OtpModal email={form.getValues('email')} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
