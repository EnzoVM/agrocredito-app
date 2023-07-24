
import { useEffect, useState, ChangeEvent, FormEvent, Dispatch, SetStateAction} from "react"
import { Button, Modal } from "flowbite-react"
import FamerTableSkeleton from '../farmer/FarmerTableSkeleton'
import { listFarmerService } from "@/services/farmer.service"
import { listProjectBySectorService } from "@/services/project.service"

interface Props {
  modalFormIsOpen: boolean
  setModalFormIsOpen: (modalFormIsOpen: boolean) => void
  creditRequest: {
    farmerId: string;
    campaignId: string;
    hectareNumber: number;
    creditReason: string;
    creditAmount: number;
    guaranteeDescription: string;
    guaranteeAmount: number;
    technicalId: number;
    creditRequestObservation: string;
  }
  setCreditRequest: Dispatch<SetStateAction<{
    farmerId: string;
    campaignId: string;
    hectareNumber: number;
    creditReason: string;
    creditAmount: number;
    guaranteeDescription: string;
    guaranteeAmount: number;
    technicalId: number;
    creditRequestObservation: string;
  }>>
  setFarmer: Dispatch<SetStateAction<string>>
}

export default function FarmerListModal({ modalFormIsOpen, setModalFormIsOpen, creditRequest, setCreditRequest, setFarmer}: Props) {
  const [farmers, setFarmers] = useState<{
    farmerId: string
    farmerQualityDescription: string
    farmerType: string
    socialReason?: string
    fullNames?: string
    dni?: string
    ruc?: string
  }[]>([])

  const [filters, setFilters] = useState<{
    searchType: 'code' | 'name'
    farmerId: string
    farmerFullNames: string
    farmerSocialReason: string
    farmerType: 'Individual' | 'Asociación'
    page: number, 
    limit: number
  }>({
    searchType: 'code',
    farmerId: '',
    farmerFullNames: '',
    farmerSocialReason: '',
    farmerType: 'Individual',
    page: 1,
    limit: 6
  })

  const [paginationSelected, setPaginationSelected] = useState(1)
  const [paginationNumbers, setPaginationNumbers] = useState<number[]>([1,2,3,4,5])
  const [totalNumberOfCampaigns, setTotalNumberOfCampaigns] = useState(0)
  const [inputSearchFilter, setInputSearchFilter] = useState('')
  const [isLoadding, setIsLoadding] = useState(true)
  const [projectList, setProjectList] = useState<{
    projectId: string
    projectDescription: string
    projectSectorId: number
    projectCode: number
  }[]>([])
  const [farmerIdSearch, setFarmerIdSearch] = useState('')

  const paginateUnSelectedStyle = 'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
  const paginateSelectedStyle = 'px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white'

  useEffect(() => {
    setIsLoadding(true)
    listFarmerService({
      searchType: filters.searchType,
      farmerId: filters.farmerId,
      farmerFullNames: filters.farmerFullNames,
      farmerSocialReason: filters.farmerSocialReason,
      farmerType: filters.farmerType,
      page: filters.page,
      limit: filters.limit
    })
      .then(response => {
        setFarmers(response.farmers)
        setTotalNumberOfCampaigns(response.count)
        setIsLoadding(false)
      })
      .catch(error => console.log(error))
  }, [filters])

  const changeProjectsBySectorHandler = async (event: ChangeEvent<HTMLSelectElement>) => {
    const sectorId = event.target.value
    
    if (sectorId === '') {
      setFarmerIdSearch('')
    }
    const projectsFound = await listProjectBySectorService({ sectorId: Number(sectorId) })
    setProjectList(projectsFound)
    setFarmerIdSearch(sectorId)
    setFilters({ ...filters, farmerId: sectorId })
  }

  const handlerChangeSetProject = async (event: ChangeEvent<HTMLSelectElement>) => {
    const projectId = event.target.value
    const getActualSector = farmerIdSearch.split('.')[0]
    
    if (projectId === '') {
      setFarmerIdSearch(getActualSector)
    }
    setFarmerIdSearch(`${getActualSector}.${projectId}`)
    setFilters({ ...filters, farmerId: `${getActualSector}.${projectId}` })
  }

  const handlerChangeFarmerType = async (event: ChangeEvent<HTMLSelectElement>) => {
    const farmerType = event.target.value as 'Individual' | 'Asociación'

    setFilters({ ...filters, farmerType: farmerType })
  }

  const handlerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if(inputSearchFilter === ''){
      return setFilters({
        searchType: 'code',
        farmerId: '',
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
        searchType: 'name', 
        page: 1
      })
    }

    if(filters.farmerType === 'Asociación'){
      return setFilters({
        ...filters, 
        farmerSocialReason: inputSearchFilter, 
        farmerFullNames: '', 
        searchType: 'name', 
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
      <Modal show={modalFormIsOpen} onClose={() => setModalFormIsOpen(false)}>
        <Modal.Header className="border-b w-full border-gray-200 dark:border-gray-700 dark:bg-gray-800">
            Listado de Agricultores
        </Modal.Header>
        <Modal.Body className="border-b w-full border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex justify-end pb-2">
            <p className="w-40 mr-4">Tipo:</p>
            <p className="w-40 mr-4">Sector:</p>
            <p className="w-40">Proyecto:</p>
          </div>
          <div className="flex justify-between">
            <div className="flex justify-end pb-4">
              <select name="campaignTypeId" onChange={handlerChangeFarmerType} className="w-40 mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="Individual">Individual</option>
                <option value="Asociación">Asociación</option>
              </select>
              <select name="campaignTypeId" onChange={changeProjectsBySectorHandler} className="w-40 mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Elegir sector</option>
                <option value="2">Margen derecha - 2</option>
                <option value="3">Tumbes - 3</option>
                <option value="4">Margen izquierda - 4</option>
              </select>
              <select name="campaignTypeId" onChange={handlerChangeSetProject} className="w-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Elegir proyecto</option>
                {
                  projectList.map(project => (
                    <option value={project.projectCode} key={project.projectId}>{project.projectDescription} - {project.projectCode}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <div className="relative border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex justify-end p-4">
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
                  <th scope="col" className="px-6 py-3">
                    Código
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Calidad
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tipo
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {
                      filters.farmerType === 'Individual' ? 'NOMBRES' : 'RAZÓN SOCIAL'
                    }
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {
                      filters.farmerType === 'Individual' ? 'DNI' : 'RUC'
                    }
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Seleccionar Agricultor
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  isLoadding
                  ?
                    <FamerTableSkeleton />
                  :
                    totalNumberOfCampaigns === 0
                    ?
                      <div className="text-center text-gray-600">
                          No se encontraron resultados.
                      </div>
                    :
                      farmers.map(farmer => (
                        <tr key={farmer.farmerId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <th
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            {farmer.farmerId}
                          </th>
                          <td className="px-6 py-4">{farmer.farmerQualityDescription}</td>
                          <td className="px-6 py-4">{farmer.farmerType}</td>
                          <td className="px-6 py-4">{filters.farmerType === 'Individual' ? farmer.fullNames : farmer.socialReason}</td>
                          <td className="px-6 py-4">{filters.farmerType === 'Individual' ? farmer.dni : farmer.ruc}</td>
                          <td className="px-6 py-4">
                          <Button
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                            onClick={() => {
                              setCreditRequest({... creditRequest, farmerId: farmer.farmerId})
                              let farmerName = filters.farmerType === 'Individual' ? farmer.fullNames : farmer.socialReason
                              setFarmer(farmer.farmerId+' - '+farmerName)
                              setModalFormIsOpen(false)
                            }}
                          >
                            Seleccionar
                          </Button>
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
        </Modal.Body>
      </Modal>
    </>
  );
}
