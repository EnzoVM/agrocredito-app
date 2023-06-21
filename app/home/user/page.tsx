import Link from "next/link";

export default async function Home () {
  return (
    <>
      <p>
        Esto es page de user
      </p>
      <Link href='/'>
        Ir al home
      </Link>
    </>
  )
}