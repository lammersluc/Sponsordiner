'use client';

import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {

  const [reserveringenVisible, setReserveringenVisible] = useState(false);
  const [reserveringen, setReserveringen] = useState([]);
  const [personen, setPersonen] = useState(0);
  const [wijn, setWijn] = useState(0);
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
      toast('De token is niet correct');
      return;
    }

    const json = await data.json();
    setReserveringen(await json.map((r: any) => {

      return (
        <div key="reserveringen" className="flex flex-col items-center w-full p-4 m-2 bg-white rounded-lg shadow-lg">
          <text className="text-2xl font-bold text-black text-center">{r.naam}</text>
          <text className="text-xl text-black text-center">{r.email}</text>
          <text className="text-xl text-black text-center">{r.personen} {r.personen === 1 ? 'persoon' : 'personen'}</text>
          <text className="text-xl text-black text-center">{r.wijn} wijn</text>
          <text className="text-xl text-black text-center">{r.extra}</text>
        </div>
      );

    }));

    let p = 0;
    json.forEach((r: any) => {
      p += r.personen;
    });

    setPersonen(p);

    let w = 0;
    json.forEach((r: any) => {
      w += r.wijn;
    });

    setWijn(w);

    setReserveringenVisible(true);
    toast('Success')
    
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
                className="border rounded-md shadow-lg p-2"
                style={{ color: 'black' }}
                required={true}
              />

            </label>
    
            <button type="submit" className="bg-blue-500 text-white font-semibold py-2 rounded-md shadow-lg hover:bg-blue-700 transition duration-300">
              Auth
            </button>
    
          </form>
    
        </div>}

        {reserveringenVisible && 
        <div key="header" className="flex flex-col items-center w-full p-4 m-2 bg-white rounded-lg shadow-lg">
          <text className="text-2xl font-bold text-black text-center">Reserveringen: {reserveringen.length}</text>
          <text className="text-2xl font-bold text-black text-center">Personen: {personen}</text>
          <text className="text-2xl font-bold text-black text-center">Wijn: {wijn}</text>
        </div>
        }
        {reserveringenVisible && reserveringen}

      </div>
      <Toaster containerStyle={{textAlign:'center'}}/>
    </main>
  )
}
