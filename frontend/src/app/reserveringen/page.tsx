'use client';

import { useEffect, useState } from 'react';

export default function Home() {

  const [reserveringen, setReserveringen] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await (await fetch('https://maud.lammers.me/api/reserveringen')).json();

      setReserveringen(await data.map((r: any) => {

        return (
          <div className="flex flex-col items-center justify-center w-full p-4 m-2 bg-white rounded-lg shadow-lg">
            <p className="text-2xl font-bold" style={{color: 'black'}}>{r.naam}</p>
            <p className="text-xl" style={{color: 'black'}}>{r.email}</p>
            <p className="text-xl" style={{color: 'black'}}>{r.personen} personen</p>
            <p className="text-xl" style={{color: 'black'}}>{r.wijn} personen wijn arrangement</p>
            <p className="text-xl" style={{color: 'black'}}>{r.extra}</p>
          </div>
        );

      }));
      
    }
    fetchData();

  }, []);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="flex flex-col items-center justify-center w-full p-4">
      {reserveringen}
      </div>
    </main>
  )
}
