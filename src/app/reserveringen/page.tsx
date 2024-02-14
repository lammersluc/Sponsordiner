'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Home() {

  enum Tables {
    families,
    ondernemers
  }

  const [visible, setVisible] = useState(Tables.families);
  const [tables, setTables] = useState<any>();
  const [authData, setAuthData] = useState({
    token: '',
  });
  
  function reserveringMaker(json: any) {

    let tables: any = { families: {}, ondernemers: {} };
    
    Object.keys(json).forEach((key: string) => {

      let table: any = { personen: 0, wijn: 0, reserveringen: [] };

      table.reserveringen = json[key].map((r: any, i: string) => {

        table.personen += r.personen;
        table.wijn += r.wijn;

        return (
          <div key={i} onClick={() => showExtra(i)} className="flex flex-col items-center p-4 m-2 bg-white rounded-2xl shadow-lg transition-colors hover:cursor-pointer hover:bg-slate-200">
            <p className="text-2xl font-bold text-black text-center">{r.naam}</p>
            <p className="text-xl text-black text-center">{r.email}</p>
            <p className="text-xl text-black text-center">{r.personen} {r.personen === 1 ? 'persoon' : 'personen'}</p>
            <p className="text-xl text-black text-center">{r.wijn} wijn</p>
            <p id={i} className="text-xl text-black text-center max-w-xs hidden">{r.extra || 'geen'}</p>
          </div>
        );

      })

      table.header =
        <div key="header" onClick={switchVisible} className="flex flex-col items-center p-4 m-2 bg-white rounded-2xl shadow-lg transition-colors hover:cursor-pointer hover:bg-slate-200">
          <p className="text-2xl font-bold text-black text-center">{key[0].toUpperCase() + key.slice(1)}</p>
          <p className="text-2xl font-bold text-black text-center">Reserveringen: {table.reserveringen.length}</p>
          <p className="text-2xl font-bold text-black text-center">Personen: {table.personen}</p>
          <p className="text-2xl font-bold text-black text-center">Wijn: {table.wijn}</p>
        </div>;

        tables[key] = table;

    });

    setTables(tables);

  }

  const showExtra = (id: string) => document.getElementById(id)?.classList.toggle('hidden');

  const switchVisible = () => setVisible(p => p === Tables.families ? Tables.ondernemers : Tables.families);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value })
  }

  const handleAuth = async (e: any) => {

    e.preventDefault();

    const data = await fetch('/api/reserveringen', {
      headers: {
        'Authorization': `Bearer ${authData.token}`
      }
    });

    if (data.status !== 200) {
      toast('De token is niet correct');
      return;
    }

    reserveringMaker(await data.json());

    toast('Success')
    
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
        {
          !tables ? (
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

            </div>
          ) : (
            <>
              {
                visible === Tables.families ?
                  (
                    <>
                      <div className="width-full">
                        {tables.families.header}
                      </div>
                      <div className="flex flex-row flex-wrap items-center justify-center p-4">
                        {tables.families.reserveringen}
                      </div>
                    </>
                  ) : visible === Tables.ondernemers &&
                  (
                    <>
                      {tables.ondernemers.header}
                      {tables.ondernemers.reserveringen}
                    </>
                  )
              }
            </>
          )
        }

    </main>
  )
}