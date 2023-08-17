

export default function SectorTableSkeleton() {

  const quantity = [1,2,3,4,5,6,7,8]

  return (
    <>
    {
      quantity.map(number => (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={number}>
          <th
            scope="row"
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          > 
            <div role="status"  className="space-y-2.5 animate-pulse max-w-lg">         
              <div  className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>              
              <div  className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            </div>
          </th>
          <td className="px-6 py-4">
            <div role="status"  className="space-y-2.5 animate-pulse max-w-lg">         
              <div  className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>              
              <div  className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div role="status"  className="space-y-2.5 animate-pulse max-w-lg">         
              <div  className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>              
              <div  className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
            </div>
          </td>
        </tr>
      ))
    }
    </>
  )
}