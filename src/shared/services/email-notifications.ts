import { ReactNode } from 'react';

import { resend } from '@/shared/lib/resend';

type NoteMailConfig = {
  to: string;
  subject: string;
  reactNode: ReactNode;
  text?: string;
};

const sendToEmail = async ({ to, subject, reactNode, text }: NoteMailConfig) =>
  resend.emails.send({
    from: process.env.CALLBACK_FROM || '',
    to,
    subject,
    react: reactNode,
    text
  });

export const emailNotifications = { sendToEmail };
