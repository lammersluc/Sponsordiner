'use client';

import { useState } from 'react';

export default function Home() {

  const [reserveringenVisible, setReserveringenVisible] = useState(false);
  const [reserveringen, setReserveringen] = useState([]);
  const [authData, setAuthData] = useState({
    token: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value })
  }

  const handleAuth = async (e: any) => {

    e.preventDefault();

    const data = await fetch('https://maud.lammers.me/api/reserveringen', {
      headers: {
        'Authorization': `Bearer ${authData.token}`
      }
    });

    if (data.status != 200) {
      alert('De token is niet correct');
      return;
    }

    setReserveringen(await (await data.json()).map((r: any) => {

      return (
        <div key="reserveringen" className="flex flex-col items-center justify-center w-full p-4 m-2 bg-white rounded-lg shadow-lg">
          <p className="text-2xl font-bold" style={{color: 'black'}}>{r.naam}</p>
          <p className="text-xl" style={{color: 'black'}}>{r.email}</p>
          <p className="text-xl" style={{color: 'black'}}>{r.personen} {r.personen == 1 ? 'persoon' : 'personen'}</p>
          <p className="text-xl" style={{color: 'black'}}>{r.wijn} {r.wijn == 1 ? 'persoon' : 'personen'} wijn</p>
          <p className="text-xl" style={{color: 'black'}}>{r.extra}</p>
        </div>
      );

    }));

    setReserveringenVisible(true);
    
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="flex flex-col items-center justify-center w-full p-4">
        {!reserveringenVisible &&
            <div className="relative flex flex-col items-center p-14 z-10 rounded-md shadow-m">

            <form onSubmit={handleAuth} className="flex flex-col space-y-4">
      
              <label className="flex flex-col">
                <span className="text-sm font-semibold mb-1">Token</span>
                <input
                  type="password"
                  name="token"
                  value={authData.token}
                  onChange={handleChange}
                  className="border rounded-md p-2"
                  style={{ color: 'black' }}
                  required={true}
                />
              </label>
      
              <button type="submit" className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Auth
              </button>
      
            </form>
      
          </div>}
        {reserveringenVisible && reserveringen}
      </div>
    </main>
  )
}
