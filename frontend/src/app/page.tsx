'use client';

import { useState } from 'react';
import Image from 'next/image'

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
      alert('Vul uw naam in.');
      return;
    }

    if (!formData.email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      alert('Email bestaat niet.');
      return;
    }

    if (formData.personen < 1) {
      alert('Vul het aantal personen in.');
      return;
    }

    if (formData.personen > 15) {
      alert('Het aantal personen mag niet hoger zijn dan 15.');
      return;
    }

    if (formData.wijn < 0) {
      alert('Vul een geldig aantal personen in voor het wijn arrangement.');
      return;
    }

    if (formData.wijn > formData.personen) {
      alert('Het aantal personen voor het wijn arrangement kan niet hoger zijn dan het aantal personen.');
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
      alert('Bedankt voor uw reservering! U ontvangt een bevestiging per mail.')
      setStatus('Gereserveerd!')
    } else if (result.status == 409) {
      alert('Er is al een reservering gemaakt met dit email adres.')
      setStatus('Er ging iets fout...')
    } else if (result.status == 403) {
      alert('Reserveringen zijn gesloten.')
      setStatus('Er ging iets fout...')
    } else {
      setStatus('Er ging iets fout...')
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
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-6 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Doneer nu!&nbsp;
        </p>
        </a>
        <div className="fixed bottom-0 left-0 flex h-24 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
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

      <div className="relative flex flex-col items-center p-14 rounded-md shadow-m"
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
              className="border rounded-md p-2"
              style={{ color: 'black' }}
              required={true}
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
              className="border rounded-md p-2"
              style={{ color: 'black' }}
              required={true}
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-1">Totaal Personen</span>
            <input
              type="number"
              name="personen"
              value={formData.personen}
              onChange={handleChange}
              className="border rounded-md p-2"
              style={{ color: 'black' }}
              required={true}
            />
          </label>

          <label className="flex flex-col">

            <span className="text-sm font-semibold mb-1">Personen Wijn Arrangement (+€22,50)</span>
              <input
                type="number"
                name="wijn"
                value={formData.wijn}
                onChange={handleChange}
                className="border rounded-md p-2"
                style={{ color: 'black' }}
                required={true}
              />

          </label>

          <label className="flex flex-col">
            <span className="text-sm font-semibold">Dieet Wensen </span><span className="text-xs mb-1">(Vegetarisch, Allergenen...)</span>
            <textarea
              name="extra"
              value={formData.extra}
              onChange={handleChange}
              className="border rounded-md p-2"
              style={{ color: 'black' }}
            />
          </label>

          <button type="submit" className="bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-300">
            {status}
          </button>

        </form>

      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
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
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            24 Maart{' '}
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Het diner vindt plaats op 24 maart 2024, inloop 17.30-18.00.
          </p>
        </a>

        <a
          href="https://www.lust-nu.nl"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Lust{' '}
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Het diner zal plaatsvinden bij Lust, een restaurant in Budel.
          </p>
        </a>

        <a
          href="https://www.runforkikamarathon.nl/wenen-marathon-2024"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            KiKa{' '}
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Dit diner is onderdeel van de Run For KiKa Marathon.
          </p>
        </a>
      </div>
    </main>
  )
}
