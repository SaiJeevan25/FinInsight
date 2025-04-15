import React from 'react'
import { FiCloudLightning } from 'react-icons/fi'

export default function Test123() {
  return (
    <div className='mx-2 flex justify-center flex-col gap-0 leading-none'>
      <div className='flex m-0 antic-didone justify-evenly gap-2 text-[7.3rem] '>
        <p className="tracking-tighter">Your</p>
        <p className="tracking-tighter text-orange-800">Collaborative</p>
        <p className="tracking-tighter ">Skill</p>
        <p className="tracking-tighter ">Hub</p>
      </div>
      <div className="my-2 py-2 relative h-screen">
        <img
          src="/orangebg.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover rounded-4xl z-0"
        />

        <div className="absolute left-0 top-0  bg-gray-900/50 rounded-4xl h-full w-full " />

        <div className="absolute bottom-5 left-5 right-5 px-4 flex flex-col text-white z-10">
          <div className="flex flex-row justify-between items-center px-6 py-4">
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

          <h1 className="text-[8.2rem] sgxo  uppercase tracking-tight leading-none text-orange-500">
            Skills Sphere
          </h1>

        </div>
      </div>

      <div></div>
    </div>
  )
}
