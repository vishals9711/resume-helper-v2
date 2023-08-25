"use client";
import { Chat } from '@/components/chat'
import UserContext from '@/components/ui/UserProvider';
import { nanoid } from 'nanoid'
import Image from 'next/image'
import { redirect } from 'next/navigation';
import React from 'react';
import { LoaderIcon } from 'react-hot-toast';

export const runtime = 'edge'
export default function Home() {
  const session = React.useContext(UserContext)?.session;
  const id = nanoid()
  React.useEffect(() => {
    console.log(session)
    if (!session?.user) {
      redirect('/sign-in')
    }
  }, [session]);
  return session ? <Chat id={id} /> : <LoaderIcon />;
}
