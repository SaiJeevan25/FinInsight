import React, { useEffect, useState } from 'react'
import { FiCloudLightning } from 'react-icons/fi'

export default function Test123() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true)
    }, 700)

    return () => clearTimeout(timer)
  }, [])
  return (
    <div className='mx-2 flex justify-center flex-col gap-0 leading-none'>
      <div
        className={`absolute inset-0 flex items-center justify-center bg-white z-50 transition-all duration-1000 ease-in-out ${loaded ? 'opacity-0 -translate-y-full' : 'opacity-100'
          }`}
      >
        <h1 className="text-[8.5rem] text-orange-500 sgxo font-bold uppercase tracking-tight">
          Skills Sphere
        </h1>
      </div>
      <div className={`transition-all duration-1000 delay-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className='flex m-0 antic-didone justify-evenly gap-2 text-[7.3rem] '>
          <p className={`tracking-tighter transition-all duration-700 delay-700 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>Your</p>
          <p className={`tracking-tighter text-orange-600 transition-all duration-700 delay-800 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>Collaborative</p>
          <p className={`tracking-tighter  transition-all duration-700 delay-800 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>Skill</p>
          <p className={`tracking-tighter  transition-all duration-700 delay-800 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>Hub</p>
        </div>
        <div className={`my-2 py-2 relative h-screen transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <img
            src="/orangebg.jpg"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover rounded-4xl z-0"
          />

          <div className="absolute left-0 top-0  bg-gray-900/50 rounded-4xl h-full w-full " />

          <div className="absolute bottom-5 left-5 right-5 leading-none flex flex-col text-white z-10">
            <div className={`flex flex-row justify-between items-center px-6 py-4 transition-all duration-1000 delay-1000 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex flex-col p-2  rounded-4xl text-white">
                <p className="text-3xl ">Connect. Learn. Grow</p>
                <p className="text-xl">Transform your skills through collaboration.</p>
              </div>
              <div className="flex flex-row gap-2 text-white z-50 text-xl">
                <div className="flex items-center gap-3 px-3 border border-white rounded-2xl w-[430px]">
                  <div className="w-3 h-3 bg-white rounded-full" />
                  <input
                    type="text"
                    name="email"
                    placeholder="Enter Your Email _"
                    className="w-full p-2 bg-transparent text-lg text-white focus:outline-0"
                  />
                </div>
                <button
                  onClick={null}
                  className="px-8 py-4 text-black bg-orange-500 rounded-4xl hover:bg-orange-600 transition-all duration-200"
                >
                  Hop In <FiCloudLightning className="inline-block ml-1" />
                </button>
              </div>
            </div>

            <h1 className={`text-[8.45rem] uppercase tracking-tight leading-none text-orange-500 sgxo transition-all duration-1000 delay-1200 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
              Skills Sphere
            </h1>

          </div>
        </div>
      </div>
    </div>
  )
}
