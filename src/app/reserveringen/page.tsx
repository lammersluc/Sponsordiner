'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Home() {

  enum Tables {
    none,
    families,
    ondernemers,
  }

  const [visible, setVisible] = useState(Tables.none);
  const [tables, setTables] = useState<any>();
  const [authData, setAuthData] = useState({
    token: '',
  });

  function reserveringMaker(json: any) {

    let tables: any = { families: {}, ondernemers: {} };
    
    Object.keys(json).forEach((key: string) => {

      let table: any = { personen: 0, wijn: 0, reserveringen: [] };

      table.reserveringen = json[key].map((r: any, i: number) => {

        table.personen += r.personen;
        table.wijn += r.wijn;

        return (
          <div key={i} className="flex flex-col items-center p-4 m-2 bg-white rounded-2xl shadow-lg">
            <text className="text-2xl font-bold text-black text-center">{r.naam}</text>
            <text className="text-xl text-black text-center">{r.email}</text>
            <text className="text-xl text-black text-center">{r.personen} {r.personen === 1 ? 'persoon' : 'personen'}</text>
            <text className="text-xl text-black text-center">{r.wijn} wijn</text>
            <text className="text-xl text-black text-center">{r.extra}</text>
          </div>
        );

      })

      table.header =
        <div key="header" onClick={switchVisible} className="flex flex-col items-center p-4 m-2 bg-white rounded-2xl shadow-lg hover:cursor-pointer">
          <text className="text-2xl font-bold text-black text-center">{key[0].toUpperCase() + key.slice(1)}</text>
          <text className="text-2xl font-bold text-black text-center">Reserveringen: {table.reserveringen.length}</text>
          <text className="text-2xl font-bold text-black text-center">Personen: {table.personen}</text>
          <text className="text-2xl font-bold text-black text-center">Wijn: {table.wijn}</text>
        </div>;

        tables[key] = table;

    });

    setTables(tables);

  }

  const switchVisible = () => {
    console.log(visible)
    visible === Tables.families ? setVisible(Tables.ondernemers) : setVisible(Tables.families);
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setAuthData({ ...authData, [name]: value })
  }

  const handleAuth = async (e: any) => {

    e.preventDefault();

    const data = await fetch('/api/reserveringen', {
      headers: {
        Authorization: `Bearer ${authData.token}`
      }
    });

    if (data.status !== 200) {
      toast('De token is niet correct');
      return;
    }

    reserveringMaker(await data.json());

    switchVisible();
    toast('Success')
    
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="flex flex-row flex-wrap items-center justify-center w-full p-4">
        {
          visible === Tables.none ? (
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
                      {tables.families.header}
                      {tables.families.reserveringen}
                    </>
                  ) :
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

      </div>
    </main>
  )
}