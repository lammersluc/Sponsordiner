'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Page() {

  const [table, setTable] = useState<any>();
  const [authData, setAuthData] = useState({
    token: '',
  });
  
  function reserveringMaker(json: any) {

    let t: any = { personen: 0, wijn: 0, reserveringen: [] };

    t.reserveringen = json.map((r: any, i: string) => {

      t.personen += r.personen;
      t.wijn += r.wijn;

      return (
        <div key={i} onClick={() => showExtra(i)} className='inline-block'>
          <div className="flex flex-col items-center p-4 m-2 bg-white rounded-2xl shadow-lg transition-colors hover:cursor-pointer hover:bg-slate-200">
            <p className="text-2xl font-bold text-black text-center">{r.naam}</p>
            <p className="text-xl text-black text-center">{r.email}</p>
            <p className="text-xl text-black text-center">{r.personen} {r.personen === 1 ? 'persoon' : 'personen'}</p>
            <p className="text-xl text-black text-center">{r.wijn} wijn</p>
            <p id={i} className="text-xl text-black text-center max-w-xs hidden">{r.extra || 'geen'}</p>
          </div>
        </div>
      );

    });

    t.header = (
      <div key="header" className="flex flex-col p-4 m-2 bg-white rounded-2xl shadow-lg">
        <p className="text-2xl font-bold text-black text-center">Families</p>
        <p className="text-2xl font-bold text-black text-center">Reserveringen: {t.reserveringen.length}</p>
        <p className="text-2xl font-bold text-black text-center">Personen: {t.personen}</p>
        <p className="text-2xl font-bold text-black text-center">Wijn: {t.wijn}</p>
      </div>
    );

    setTable(t);
  }

  const showExtra = (id: string) => document.getElementById(id)?.classList.toggle('hidden');

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value })
  }

  const handleAuth = async (e: any) => {

    e.preventDefault();

    const promise = new Promise<string>(async (resolve, reject) => {

      const result: any = await Promise.race([
        fetch('/api/reserveringen', {
          headers: {
            'Authorization': `Bearer ${authData.token}`
          }
        }),
        new Promise((_, reject) => setTimeout(() => reject(), 10000))
      ]).catch(() => ({ status: 500, ok: false }));

      if (!result.ok) return reject('De token is niet correct');

      reserveringMaker(await result.json());
      resolve('Reserveringen geladen');

    });

    toast.promise(promise, {
      loading: 'Laden...',
      success: msg => msg,
      error: err => err
    });

  }
  
  return (
    <>
        {
          table ? (
            <div>
              <div className='flex justify-center'>
                {table.header}
              </div>
              <div className="flex flex-row flex-wrap justify-center m-2">
                {table.reserveringen}
              </div>
            </div>
          ) : (
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

                <button type="submit" className="bg-blue-600 text-white font-semibold py-2 rounded-md shadow-lg hover:bg-blue-700 transition duration-300">
                  Bekijk
                </button>

              </form>

            </div>
          )

        }

    </>
  );
}