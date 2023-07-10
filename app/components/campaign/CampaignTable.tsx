"use client";

import CreateCampaignModal from "./CreateCampaignModal";
import DeleteCampaignModal from "./DeleteCampaignModal";
import CampaignTableSkeleton from "./CampaignTableSkeleton";
import { Button } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState, ChangeEvent, FormEvent} from "react";
import { listCampaignService } from "@/services/campaign.service"

export default function CampaignTable() {

  const [campaignList, setCampaignList] = useState<{
    campaignId: string;
    campaignDescription: string;
    campaignTypeDescription: string;
    periodName: string;
    campaignYear: string,
    startDate: string,
    finishDate: string
  }[]>([])

  const [filters, setFilters] = useState<{
    filter: string,
    page: number, 
    limit: number,
    typeSearch: 'code' | 'all' | 'year'
  }>({filter: '', page: 1, limit: 8, typeSearch: 'all'})

  const [campaingDeleted, setCampaingDeleted] = useState('')
  const [paginationSelected, setPaginationSelected] = useState(1)
  const [paginationNumbers, setPaginationNumbers] = useState<number[]>([1,2,3,4,5])
  const [totalNumberOfCampaigns, setTotalNumberOfCampaigns] = useState(0)
  const [inputSearchFilter, setInputSearchFilter] = useState('')
  const [isLoadding, setIsLoadding] = useState(true)
  const [modalFormIsOpen, setModalFormIsOpen] = useState(false);
  const [modalDeleteCampaignIsOpen, setModalDeleteCampaignIsOpen] = useState(false);

  const paginateUnSelectedStyle = 'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
  const paginateSelectedStyle = 'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white'

  useEffect(() => {
    setIsLoadding(true)
    listCampaignService({
      filter: filters.filter, 
      page: filters.page, 
      limit: filters.limit, 
      typeSearch: filters.typeSearch})
      .then(response => {
        setCampaignList(response.campaignList)
        setTotalNumberOfCampaigns(response.count)
        setIsLoadding(false)
      })
      .catch(error => console.log(error))
  }, [filters])

  const handlerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const firstChar = inputSearchFilter.charAt(0);
    const startsWithNumber = !isNaN(parseInt(firstChar, 10));
    const startsWithString = isNaN(parseInt(firstChar, 10))
    
    if(inputSearchFilter === ''){
      return setFilters({... filters, filter: inputSearchFilter, typeSearch: 'all', page: 1})
    }

    if(startsWithNumber){
      setFilters({... filters, filter: inputSearchFilter, typeSearch: 'year', page: 1})
    }

    if(startsWithString){
      setFilters({... filters, filter: inputSearchFilter, typeSearch: 'code', page: 1})
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
    if(filters.page >= Math.ceil(totalNumberOfCampaigns/filters.limit)){
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
      <CreateCampaignModal 
        modalFormIsOpen={modalFormIsOpen} 
        setModalFormIsOpen={setModalFormIsOpen}
        setFilters={setFilters} 
        setPaginationSelected={setPaginationSelected}
        setPaginationNumbers={setPaginationNumbers}
      />
      <DeleteCampaignModal 
        modalDeleteCampaignIsOpen={modalDeleteCampaignIsOpen} 
        setModalDeleteCampaignIsOpen={setModalDeleteCampaignIsOpen} 
        campaignId={campaingDeleted} 
        setFilters={setFilters} 
        setPaginationSelected={setPaginationSelected}
        setPaginationNumbers={setPaginationNumbers}
      />
      <div className="relative border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex justify-between p-4">
          <Button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
            onClick={() => setModalFormIsOpen(true)}
          >
            Crear campaña
          </Button>
        
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
                  className="mr-4 block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Buscar campaña por código o año"
                  onChange={handlerChange}
                />
                <Button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
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
              <th scope="col" className="px-6 py-3">
                Código
              </th>
              <th scope="col" className="px-6 py-3">
                Descripción
              </th>
              <th scope="col" className="px-6 py-3">
                Tipo de campaña
              </th>
              <th scope="col" className="px-6 py-3">
                Periodo de campaña
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha inicial
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha final
              </th>
              <th scope="col" className="px-6 py-3">
                Año de campaña
              </th>
              <th scope="col" className="px-6 py-3">
                Ingresar
              </th>
              <th scope="col" className="px-6 py-3">
                Eliminar
              </th>
            </tr>
          </thead>
          <tbody>
            {
              isLoadding
              ?
                <CampaignTableSkeleton></CampaignTableSkeleton>
              :
                totalNumberOfCampaigns === 0
                ?
                  <div className="text-center text-gray-600">
                      No se encontraron resultados.
                  </div>
                :
                  campaignList.map(response => (
                    <tr key={response.campaignId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {response.campaignId}
                      </th>
                      <td className="px-6 py-4">{response.campaignDescription}</td>
                      <td className="px-6 py-4">{response.campaignTypeDescription}</td>
                      <td className="px-6 py-4">{response.periodName}</td>
                      <td className="px-6 py-4">{response.startDate}</td>
                      <td className="px-6 py-4">{response.finishDate}</td>
                      <td className="px-6 py-4">{response.campaignYear}</td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/home/campaign/${response.campaignId}`}
                          className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Ingresar
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-3 py-2 text-xs font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={() => {setModalDeleteCampaignIsOpen(true), setCampaingDeleted(response.campaignId)}}>
                          Eliminar
                        </button>
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
              {totalNumberOfCampaigns === 0 ? 0 : filters.page*filters.limit-filters.limit+1} - {totalNumberOfCampaigns<filters.limit ? totalNumberOfCampaigns : filters.page*filters.limit<totalNumberOfCampaigns ? filters.page*filters.limit : totalNumberOfCampaigns }
            </span>{" "}
            de{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {totalNumberOfCampaigns}
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
                      if(page>Math.ceil(totalNumberOfCampaigns/filters.limit)) {
                        setFilters({...filters})
                      }else {
                        setFilters({...filters, page})
                        setPaginationSelected(page)
                      } 
                    }}
                  >
                    {page>Math.ceil(totalNumberOfCampaigns/filters.limit) ? '' : page}
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
