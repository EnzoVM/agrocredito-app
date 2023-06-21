'use client'

export default function Button () {
  const hanbleClick = () => {
    console.log('Hola drom button')
  }

  return (
    <>
      <button onClick={hanbleClick}>Hola mundo</button>
    </>
  )
}