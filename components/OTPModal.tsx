'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { InputOTP, InputOTPGroup } from '@/components/ui/input-otp';
import { OTPInputContext } from 'input-otp';
import React, { useState } from 'react';
import { Loader2, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { verifySecret, sendEmailOTP } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const OtpModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(0);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sessionId = await verifySecret({ accountId, password });

      if (sessionId) router.push('/dashboard');
    } catch (error) {
      console.error('Failed to verify OTP', error);
      setShake((s) => s + 1);
      toast({
        description: 'That code is incorrect or has expired.',
        className: 'error-toast',
      });
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    try {
      await sendEmailOTP({ email });
      toast({ description: 'A new code is on its way.' });
    } catch (error) {
      console.error('Failed to resend OTP', error);
      toast({
        description: 'Failed to resend the code. Please try again.',
        className: 'error-toast',
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="cvl w-[calc(100%-2rem)] max-w-[420px] gap-0 rounded-2xl border-border bg-card p-6 shadow-[0_40px_80px_-32px_rgba(10,13,12,0.45)] sm:p-8">
        <button
          type="button"
          aria-label="Close"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
        </button>

        <AlertDialogHeader className="items-center space-y-0 text-center sm:text-center">
          <span className="relative mb-5 flex size-12 items-center justify-center rounded-2xl border border-border bg-background">
            <Mail className="cvl-accent size-5" aria-hidden />
          </span>
          <AlertDialogTitle className="font-display text-[1.5rem] font-semibold tracking-[-0.03em] text-foreground">
            Enter your OTP
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            We sent a six-digit code to
            <span className="mt-0.5 block font-medium text-foreground">
              {email}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div
          className={cn(
            'mt-7 flex justify-center',
            shake > 0 && (shake % 2 ? 'cvl-shake' : 'cvl-shake-2')
          )}
        >
          <InputOTP
            maxLength={6}
            value={password}
            onChange={setPassword}
            autoFocus
            containerClassName="gap-2 sm:gap-3"
          >
            <InputOTPGroup className="gap-1.5 sm:gap-2">
              {[0, 1, 2].map((i) => (
                <OtpSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
            <span aria-hidden className="h-px w-3 bg-border" />
            <InputOTPGroup className="gap-1.5 sm:gap-2">
              {[3, 4, 5].map((i) => (
                <OtpSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <AlertDialogFooter className="mt-7 flex-col sm:flex-col sm:space-x-0">
          <AlertDialogAction
            onClick={handleSubmit}
            type="button"
            className="cvl-btn h-11 w-full gap-2 rounded-lg text-[14.5px] font-medium hover:bg-foreground disabled:opacity-70"
          >
            <span className="shine" aria-hidden />
            Submit
            {isLoading && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
          </AlertDialogAction>

          <p className="mt-5 text-center text-[13px] text-muted-foreground">
            Didn&apos;t get a code?
            <Button
              type="button"
              variant="link"
              className="cvl-accent h-auto p-0 pl-1.5 text-[13px] font-medium"
              onClick={handleResendOtp}
            >
              Resend it
            </Button>
          </p>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const OtpSlot = ({ index }: { index: number }) => {
  const ctx = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = ctx.slots[index];

  return (
    <div
      className={cn(
        'relative flex h-14 w-11 items-center justify-center rounded-xl border bg-background font-mono text-[1.5rem] font-medium text-foreground transition-[border-color,box-shadow,transform] duration-200 sm:w-12',
        isActive
          ? 'z-10 -translate-y-0.5 border-vault-600/70 shadow-[0_0_0_4px_rgba(14,122,110,0.12)] dark:border-vault-400/70 dark:shadow-[0_0_0_4px_rgba(112,216,185,0.12)]'
          : char
            ? 'border-vault-600/35 dark:border-vault-400/35'
            : 'border-border'
      )}
    >
      {char && (
        <span key={char} className="cvl-slot-pop">
          {char}
        </span>
      )}
      {hasFakeCaret && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="h-6 w-px animate-caret-blink bg-foreground" />
        </span>
      )}
    </div>
  );
};

export default OtpModal;
