"use client"

import { useRouter } from "next/navigation";
import Link from "next/link"
import { useEffect, useState, ChangeEvent, FormEvent} from "react"
import { Button } from "flowbite-react"
import CreditRelationTableSkeleton from "./CreditRelationTableSkeleton"
import 'moment/locale/es'
import CreditRelationGeneralReportGenerator from "./CreditRelationGeneralReportGenerator"
import { listCreditRelationsService } from "@/services/credit.relation.service"

export default function CreditRelationTable({ campaignId }: { campaignId: string }) {
  const router = useRouter()
  const [creditRelations, setCreditRelations] = useState<{
    creditRequestId: string
    farmerId: string
    fullNames?: string
    socialReason?: string
    totalDelivery: number
    totalInterest: number
    capital: number
  }[]>([])

  const [filters, setFilters] = useState<{
    campaignId: string,
    farmerType: 'Individual' | 'Asociación',
    farmerFullNames?: string, 
    farmerSocialReason?: string,
    page: number, 
    limit: number
  }>({
    campaignId: '',
    farmerFullNames: '',
    farmerSocialReason: '',
    farmerType: 'Individual',
    page: 1,
    limit: 6
  })

  const [paginationSelected, setPaginationSelected] = useState(1)
  const [paginationNumbers, setPaginationNumbers] = useState<number[]>([1,2,3,4,5])
  const [totalNumberOfDeliveries, setTotalNumberOfDeliveries] = useState(0)
  const [inputSearchFilter, setInputSearchFilter] = useState('')
  const [isLoadding, setIsLoadding] = useState(true)

  const paginateUnSelectedStyle = 'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
  const paginateSelectedStyle = 'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white'

  useEffect(() => {
    setIsLoadding(true)
    listCreditRelationsService({
      campaignId,
      farmerType: filters.farmerType,
      farmerFullNames: filters.farmerFullNames,
      farmerSocialReason: filters.farmerSocialReason,
      page: filters.page,
      limit: filters.limit
    })
      .then(response => {
        setCreditRelations(response.creditRelations)
        setTotalNumberOfDeliveries(response.count)
        setIsLoadding(false)
      })
      .catch(error => {
        if (error.message === 'You have to login again') {
          router.push('/login')
        }
      })
  }, [campaignId, filters])

  const handlerChangeFarmerType = async (event: ChangeEvent<HTMLSelectElement>) => {
    const farmerType = event.target.value as 'Individual' | 'Asociación'

    setFilters({ ...filters, farmerType: farmerType, page: 1, campaignId })
    console.log(filters)
    setPaginationSelected(1)
  }

  const handlerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if(inputSearchFilter === ''){
      return setFilters({
        ...filters,
        farmerFullNames: '',
        farmerSocialReason: '',
        farmerType: 'Individual',
        page: 1,
        limit: 6
      })
    }
    
    if(filters.farmerType === 'Individual'){
      return setFilters({
        ...filters, 
        farmerFullNames: inputSearchFilter, 
        farmerSocialReason: '',
        page: 1
      })
    }

    if(filters.farmerType === 'Asociación'){
      return setFilters({
        ...filters, 
        farmerSocialReason: inputSearchFilter, 
        farmerFullNames: '',
        page: 1
      })
    }
  }

  const handlerChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputSearchFilter(event.target.value)
  }

  const returnPreviosPage = () => {
    if(filters.page <= 1){
      setFilters({...filters})
    }else {
      setFilters({...filters, page: filters.page - 1})
      setPaginationSelected(filters.page - 1)
      if(paginationNumbers[0] > filters.page - 1) {
        const newPaginatinsNumber = paginationNumbers.map(number => number-5)
        setPaginationNumbers(newPaginatinsNumber)
      }
    }
  }

  const goNextPage = () => {
    if(filters.page >= Math.ceil(totalNumberOfDeliveries/filters.limit)){
      setFilters({...filters}) 
    }else {
      setFilters({...filters, page: filters.page + 1})
      setPaginationSelected(filters.page + 1)
      if(paginationNumbers[4] < filters.page + 1) {
        const newPaginatinsNumber = paginationNumbers.map(number => number+5)
        setPaginationNumbers(newPaginatinsNumber)
      }
    }
  }

  return (
    <>
      <div className="relative border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex justify-end p-4">
          <div className="flex justify-start w-full">
            <select name="farmerType" onChange={handlerChangeFarmerType} className="w-40 mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
              <option value="Individual">Individual</option>
              <option value="Asociación">Asociación</option>
            </select>
            <CreditRelationGeneralReportGenerator campaignId={campaignId} />
          </div>
          <label className="sr-only">Buscar</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <form onSubmit={handlerSubmit}>
              <div className="flex justify-between">
                <input
                  type="text"
                  id="table-search"
                  className="mr-4 block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-96 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Buscar abono por nombre o razón social"
                  onChange={handlerChange}
                />
                <Button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                  type="submit"
                >
                  Buscar
                </Button>
              </div>
            </form>
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">
                CODIGO DEL AGRICULTOR
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                {
                  filters.farmerType === 'Individual' ? 'NOMBRES' : 'RAZÓN SOCIAL'
                }
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                SALDO CAPITAL
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                SALDO INTERES
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                SALDO
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                MÁS INFORMACIÓN
              </th>
            </tr>
          </thead>
          <tbody>
            {
              isLoadding
              ?
                <CreditRelationTableSkeleton />
              :
                totalNumberOfDeliveries === 0
                ?
                  <div className="text-center text-gray-600">
                      No se encontraron resultados.
                  </div>
                :
                  creditRelations.map(creditRelation => (
                    <tr key={creditRelation.creditRequestId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
                      >
                        {creditRelation.farmerId}
                      </th>
                      <td className="px-6 py-4 text-center">{creditRelation.fullNames ? creditRelation.fullNames : creditRelation.socialReason}</td>
                      <td className="px-6 py-4 text-center">{creditRelation.totalDelivery}</td>
                      <td className="px-6 py-4 text-center">{creditRelation.totalInterest}</td>
                      <td className="px-6 py-4 text-center">{creditRelation.capital}</td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`credit-request/${creditRelation.creditRequestId}`}
                          className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Más información
                        </Link>
                      </td>
                    </tr>
                  ))
            }
          </tbody>
        </table>
        <nav
          className="flex items-center justify-between"
          aria-label="Table navigation"
        >
          <span className="text-sm m-4 font-normal text-gray-500 dark:text-gray-400">
            Mostrando{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalNumberOfDeliveries === 0 ? 0 : filters.page*filters.limit-filters.limit+1} - {totalNumberOfDeliveries<filters.limit ? totalNumberOfDeliveries : filters.page*filters.limit<totalNumberOfDeliveries ? filters.page*filters.limit : totalNumberOfDeliveries }
            </span>{" "}
            de{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalNumberOfDeliveries}
            </span>
          </span>
          <ul className="inline-flex m-4 items-center -space-x-px">
            <li>
              <a
                className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={returnPreviosPage}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </li>
            { 
              paginationNumbers.map(page => (
                <li key={page}>
                  <a
                    className={paginationSelected === page ? paginateSelectedStyle : paginateUnSelectedStyle}
                    onClick={() => {
                      if(page>Math.ceil(totalNumberOfDeliveries/filters.limit)) {
                        setFilters({...filters})
                      }else {
                        setFilters({...filters, page})
                        setPaginationSelected(page)
                      } 
                    }}
                  >
                    {page>Math.ceil(totalNumberOfDeliveries/filters.limit) ? '' : page}
                  </a>
                </li>
              ))
            }
            <li>
              <a
                className="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={goNextPage}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
