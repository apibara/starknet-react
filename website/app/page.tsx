import Link from 'next/link'

const Home = () => {
  return (
    <div className="flex flex-col h-screen justify-center sm:text-center items-center ">
      <div className=" text-cat-text text-7xl font-bold text-center md:text-left lg:text-center ">
        Starknet React
      </div>
      <div className=" text-cat-peach text-4xl mt-8 font-bold text-center md:text-left lg:text-center ">
        A collection of React hooks for Starknet
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-10 lg:gap-20 pt-8">
        <Link passHref href="/get-started" className="text-cat-neutral500 text-xl ">
          <div className=" py-2 px-4 hover:bg-cat-slate700  bg-cat-base border-solid border-2 rounded-md border-cat-neutral500">
            Get Started
          </div>
        </Link>
        <Link passHref href="/hooks" className=" text-cat-neutral500 text-xl">
          <div className=" py-2 px-4 hover:bg-cat-slate700 bg-cat-base border-solid border-2 rounded-md border-cat-neutral500">
            View Hooks
          </div>
        </Link>
        <Link passHref href="/rsc" className=" text-cat-neutral500 text-xl">
          <div className="py-2 px-4  hover:bg-cat-slate700 text-center bg-cat-base border-solid border-2 rounded-md border-cat-neutral500">
            RSC
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Home
