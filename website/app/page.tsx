import Link from 'next/link'

const Home = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className=" text-cat-text text-7xl font-bold">Starknet React</div>
      <div className=" text-cat-peach text-4xl mt-8 font-bold ">
        A collection of React hooks for Starknet
      </div>
      <div className="flex flex-row gap-20 pt-8">
        <Link passHref href="/get-started" className="text-cat-neutral500 text-xl ">
          <div className=" py-2 px-4 hover: hover:bg-cat-slate700  bg-cat-base border-solid border-2 rounded-md border-cat-neutral500">
            Get Started
          </div>
        </Link>
        <Link passHref href="/hooks" className=" text-cat-neutral500 text-xl">
          <div className="py-2 px-4 hover:bg-cat-slate700 bg-cat-base border-solid border-2 rounded-md border-cat-neutral500">
            View Hooks
          </div>
        </Link>
        <Link passHref href="/rsc" className=" text-cat-neutral500 text-xl">
          <div className="py-2 px-4 hover:bg-cat-slate700 w-32 text-center bg-cat-base border-solid border-2 rounded-md border-cat-neutral500">
            RSC
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Home
