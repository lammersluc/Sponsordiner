'use client';

import { useState } from 'react';
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {

  const [status, setStatus] = useState('Reserveer');

  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    personen: 0,
    wijn: 0,
    extra: ''
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    if (formData.naam == '') {
      toast('Vul uw naam in')
      return;
    }

    if (!formData.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      toast('Email bestaat niet')
      return;
    }

    if (formData.personen < 1) {
      toast('Vul het aantal personen in');
      return;
    }

    if (formData.personen > 15) {
      toast('Maximaal 15 personen per reservering');
      return;
    }

    if (formData.wijn > formData.personen || formData.wijn < 0) {
      toast('Incorrect wijn arrangement');
      return;
    }

    const body = {
      naam: formData.naam,
      email: formData.email.toLowerCase(),
      personen: Number(formData.personen),
      wijn: Number(formData.wijn),
      extra: formData.extra
    }

    setStatus('Laden...')

    const result = await fetch('https://maud.lammers.me/api/reserveringen', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (result.status == 200) {
      toast('Bedankt voor uw reservering! U ontvangt een bevestiging per mail')
      setStatus('Gereserveerd!')
    } else if (result.status == 409) {
      toast('Emailadres is al in gebruik')
      setStatus('Reserveer')
    } else if (result.status == 403) {
      toast('Reserveringen zijn gesloten')
      setStatus('Gesloten')
    } else {
      setStatus('Reserveer')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <a
        href="https://www.runforkikamarathon.nl/maud-lammers-wenen-2024"
        target="_blank"
        rel="noopener noreferrer"
        >
        <p className="z-0 rounded-md left-0 top-0 flex w-full justify-center pb-6 pt-6 backdrop-blur-2xl border-neutral-800 bg-zinc-800/30 from-inherit shadow-lg lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:bg-zinc-800/30">
          Doneer nu!&nbsp;
        </p>
        </a>
        <div className="bottom-0 left-0 flex h-24 w-full items-end justify-center bg-gradient-to-t lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-6 lg:pointer-events-auto lg:p-0"
            href="https://www.runforkikamarathon.nl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/rfkm-logo.svg"
              alt="Run For KiKa Marathon"
              width={150}
              height={10}
              priority
              style={{ filter: 'drop-shadow(0 0 1rem #00000070)' }}
            />
          </a>
        </div>
      </div>

      <div className="relative flex flex-col items-center p-8"
      style={{
        marginBottom: '-2rem',
      }}>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

          <label className="flex flex-col">

            <span className="text-sm font-semibold mb-1">Naam</span>
            <input
              type="text"
              name="naam"
              value={formData.naam}
              onChange={handleChange}
              className="border rounded-md shadow-lg p-2"
              style={{ color: 'black' }}
            />
          </label>

          <label className="flex flex-col">

            <span className="text-sm font-semibold mb-1">Email</span>
            <input
              color="black"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-md shadow-lg p-2"
              style={{ color: 'black' }}
            />

          </label>

          <label className="flex flex-col">

            <span className="text-sm font-semibold mb-1">Totaal Personen</span>
            <input
              type="number"
              name="personen"
              value={formData.personen}
              onChange={handleChange}
              className="border rounded-md shadow-lg p-2"
              style={{ color: 'black' }}
            />
          </label>

          <label className="flex flex-col">

            <span className="text-sm font-semibold mb-1">Personen Wijnarrangement (+€22,50)</span>
              <input
                type="number"
                name="wijn"
                value={formData.wijn}
                onChange={handleChange}
                className="border rounded-md shadow-lg p-2"
                style={{ color: 'black' }}
              />

          </label>

          <label className="flex flex-col">

            <span className="text-sm font-semibold">Dieet Wensen </span><span className="text-xs mb-1">(Vegetarisch, Allergenen...)</span>
            <textarea
              name="extra"
              value={formData.extra}
              onChange={handleChange}
              className="border rounded-md shadow-lg p-2"
              style={{ color: 'black' }}
            />

          </label>

          <button type="submit" className="bg-blue-500 text-white font-semibold py-2 rounded-md shadow-lg hover:bg-blue-700 transition duration-300">
            {status}
          </button>

        </form>

      </div>

      <div className="m-10 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left z-10">
        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Kosten{' '}
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Het 3-gangen diner kost €49,50 per persoon, exclusief drank.
          </p>
        </a>

        <a
          href="/calender.ics"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            24 Maart{' '}
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Op 24 maart 2024 begint het diner om 18.00.
          </p>
        </a>

        <a
          href="https://www.lust-nu.nl"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Lust{' '}
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Het diner zal plaatsvinden bij Lust, in Budel.
          </p>
        </a>

        <a
          href="https://www.runforkikamarathon.nl/wenen-marathon-2024"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            KiKa{' '}
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            De opbrengsten gaan naar de Run For KiKa Marathon.
          </p>
        </a>
      </div>
      <Toaster containerStyle={{textAlign:'center'}}/>
    </main>
  )
}
