"use client"

import { useEffect, useState, ChangeEvent, FormEvent} from "react"
import { Button } from "flowbite-react"
import Link from "next/link"
import CreditRequestTableSkeleton from "./CreditRequestTableSkeleton"
import { listCreditRequestService } from "@/services/credit.request.service"
import moment from 'moment'
import 'moment/locale/es'
import CreditRequestReportGenerator from "./CreditRequestReportGenerator"

export default function CreditRequestTable({ campaignId }: { campaignId: string }) {
  const [creditRequests, setCreditRequests] = useState<{
    creditRequestId: string
    campaignId: string
    fullNames?: string
    socialReason?: string
    creditAmount: number
    createDateTime: Date
    updateStatusDateTime?: Date
    creditRequestStatus: string
  }[]>([])

  const [filters, setFilters] = useState<{
    campaignId: string,
    farmerType: 'Individual' | 'Asociación', 
    creditRequestStatus?: 'Aprobado' | 'Pendiente' | 'Rechazado' | 'Pagado',
    farmerFullNames?: string, 
    farmerSocialReason?: string,
    page: number, 
    limit: number
  }>({
    campaignId: '',
    farmerFullNames: '',
    creditRequestStatus: undefined,
    farmerSocialReason: '',
    farmerType: 'Individual',
    page: 1,
    limit: 6
  })

  const [paginationSelected, setPaginationSelected] = useState(1)
  const [paginationNumbers, setPaginationNumbers] = useState<number[]>([1,2,3,4,5])
  const [totalNumberOfCreditRequests, setTotalNumberOfCreditRequests] = useState(0)
  const [inputSearchFilter, setInputSearchFilter] = useState('')
  const [isLoadding, setIsLoadding] = useState(true)

  const paginateUnSelectedStyle = 'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
  const paginateSelectedStyle = 'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white'

  useEffect(() => {
    setIsLoadding(true)
    listCreditRequestService({
      campaignId,
      farmerType: filters.farmerType,
      creditRequestStatus: filters.creditRequestStatus,
      farmerFullNames: filters.farmerFullNames,
      farmerSocialReason: filters.farmerSocialReason,
      page: filters.page,
      limit: filters.limit
    })
      .then(response => {
        console.log(response.creditRequests)
        setCreditRequests(response.creditRequests)
        setTotalNumberOfCreditRequests(response.count)
        setIsLoadding(false)
      })
      .catch(error => console.log(error))
  }, [campaignId, filters])

  const handlerChangeFarmerType = async (event: ChangeEvent<HTMLSelectElement>) => {
    const farmerType = event.target.value as 'Individual' | 'Asociación'

    setFilters({ ...filters, farmerType: farmerType, page: 1, campaignId })
    console.log(filters)
    setPaginationSelected(1)
  }

  const handlerChangeCreditRequestStatus = async (event: ChangeEvent<HTMLSelectElement>) => {
    const creditRequestStatus = event.target.value as 'Aprobado' | 'Pendiente' | 'Rechazado' | 'Pagado'
    console.log(filters)
    // @ts-ignore
    if (creditRequestStatus === '') {
      setFilters({ ...filters, creditRequestStatus: undefined, page: 1 })
      setPaginationSelected(1)
      return
    }

    setFilters({ ...filters, creditRequestStatus, page: 1 })
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
    if(filters.page >= Math.ceil(totalNumberOfCreditRequests/filters.limit)){
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
            <select name="creditRequestStatus" onChange={handlerChangeCreditRequestStatus} className="w-50 mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
              <option value="">Estado de solicitud </option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
              <option value="Pagado">Pagado</option>
            </select>
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
                  placeholder="Buscar agricultor por nombre o razón social"
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
                CODIGO DE CAMPAÑA
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                {
                  filters.farmerType === 'Individual' ? 'NOMBRES' : 'RAZÓN SOCIAL'
                }
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                MONTO DEL CREDITO
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                FECHA DE SOLICITUD
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                ESTADO DE SOLICITUD
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Mas información
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                REPORTE
              </th>
            </tr>
          </thead>
          <tbody>
            {
              isLoadding
              ?
                <CreditRequestTableSkeleton />
              :
                totalNumberOfCreditRequests === 0
                ?
                  <div className="text-center text-gray-600">
                      No se encontraron resultados.
                  </div>
                :
                  creditRequests.map(creditRequest => (
                    <tr key={creditRequest.creditRequestId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center"
                      >
                        {creditRequest.campaignId}
                      </th>
                      <td className="px-6 py-4 text-center">{creditRequest.fullNames ? creditRequest.fullNames : creditRequest.socialReason}</td>
                      <td className="px-6 py-4 text-center">{creditRequest.creditAmount}</td>
                      <td className="px-6 py-4 text-center">{moment(creditRequest.createDateTime).format('LLLL')}</td>
                      <td className="px-6 py-4 text-center">{
                        creditRequest.creditRequestStatus === 'Pendiente' 
                          ? <span className="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">Pendiente</span>
                          : creditRequest.creditRequestStatus === 'Aprobado'
                            ?  <span className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Aprobado</span>
                            : creditRequest.creditRequestStatus === 'Rechazado'
                              ? <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">Rechazado</span>
                              : <span className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">Pagado</span>
                      }</td>
                      <td className="px-6 py-4 text-center">
                        <Link
                          href={`credit-request/${creditRequest.creditRequestId}`}
                          className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Más información
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <CreditRequestReportGenerator creditRequestId={creditRequest.creditRequestId} />
                      </td>
                    </tr>
                  ))
            }
          </tbody>
        </table>
        <nav
          className="flex items-center justify-between pt-4"
          aria-label="Table navigation"
        >
          <span className="text-sm m-4 font-normal text-gray-500 dark:text-gray-400">
            Mostrando{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalNumberOfCreditRequests === 0 ? 0 : filters.page*filters.limit-filters.limit+1} - {totalNumberOfCreditRequests<filters.limit ? totalNumberOfCreditRequests : filters.page*filters.limit<totalNumberOfCreditRequests ? filters.page*filters.limit : totalNumberOfCreditRequests }
            </span>{" "}
            de{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalNumberOfCreditRequests}
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
                      if(page>Math.ceil(totalNumberOfCreditRequests/filters.limit)) {
                        setFilters({...filters})
                      }else {
                        setFilters({...filters, page})
                        setPaginationSelected(page)
                      } 
                    }}
                  >
                    {page>Math.ceil(totalNumberOfCreditRequests/filters.limit) ? '' : page}
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
