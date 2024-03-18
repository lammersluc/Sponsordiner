'use client';

import { useRouter } from "next/navigation";

export default function Page() {

    const router = useRouter();

  return (

    <div className="relative flex flex-col items-center p-14 z-10 rounded-md shadow-m">

        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <button onClick={() => router.push('/')} className="bg-white p-6 m-4 rounded-md shadow-lg transition-colors text-black">
                <p>
                  Door omstandigheden zijn wij genoodzaakt het sponsordiner te verplaatsen naar zondag 24 maart.
                  <br/><br/>
                  Inschrijven kan door hier te klikken.
                </p>
            </button>
        </div>

    </div>

  );
}