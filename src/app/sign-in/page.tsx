import { LoginButton } from '@/components/login-button';
import { redirect } from 'next/navigation';
import React from 'react';
import { auth } from '../../../auth';

export default async function SignInPage() {
  const session = await auth()
  // const session = React.useContext(UserContext)?.session;
  // const setSession = React.useContext(UserContext)?.setSession;
  // redirect to home if user is already logged in

  // const [name, setName] = React.useState('');
  // const [experience, setExperience] = React.useState('');
  // const [technicalSkills, setTechnicalSkills] = React.useState('');
  // const handleSignIn = () => {
  //   // You can implement your sign-in logic here
  //   // For now, let's just display an alert with the entered name
  //   // alert(`Welcome, ${name}!`);
  //   if (!name || !experience || !technicalSkills) {
  //     toast.error('Please fill all the fields')
  //     return
  //   }
  //   setSession &&
  //     setSession({
  //       user: {
  //         name: name,
  //         id: nanoid(),
  //         experience: experience,
  //         technicalSkills: technicalSkills,
  //       }
  //     });
  // };

  // React.useEffect(() => {
    console.log("Sing in ", session)
    if (session?.user) {
      redirect('/')
    }

  // }, [session]);

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
    //   <div className="p-4 mx-auto min-w-[25%] bg-gray-800 rounded-lg shadow-md text-white">
    //     <h2 className="text-2xl font-semibold mb-4 align-middle">Sign In</h2>
    //     <Input
    //       type="text"
    //       placeholder="Enter your name"
    //       value={name}
    //       onChange={(e) => setName(e.target.value)}
    //       className="w-full px-3 py-2 bg-gray-700 border rounded-lg shadow-sm mb-8 text-white h-16"
    //     />
    //     <Textarea
    //       placeholder="Enter your Experience"
    //       value={experience}
    //       onChange={(e) => setExperience(e.target.value)}
    //       cols={10}
    //       rows={10}
    //       className=" bg-gray-700 border rounded-lg shadow-sm mb-8 text-white"
    //     />
    //     <Textarea
    //       placeholder="Enter your Technical Skills"
    //       value={technicalSkills}
    //       cols={10}
    //       rows={10}
    //       onChange={(e) => setTechnicalSkills(e.target.value)}
    //       className="w-full px-3 py-2 bg-gray-700 border rounded-lg shadow-sm mb-8 text-white"
    //     />
    //     <button
    //       onClick={handleSignIn}
    //       className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
    //     >
    //       Sign In
    //     </button>
    //   </div>
    // </div>
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
    <LoginButton />
  </div>
  )
}
