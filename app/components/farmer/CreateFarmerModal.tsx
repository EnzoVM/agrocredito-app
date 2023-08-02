import { createFramerService, listFarmerAttributesServices } from "@/services/farmer.service";
import { listProjectBySectorService, listProjectService } from "@/services/project.service";
import { Button, Modal } from "flowbite-react";
import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { FormEvent, useEffect, useState } from "react";

interface Props {
  modalFormIsOpen: boolean
  setModalFormIsOpen: (modalFormIsOpen: boolean) => void
  setPaginationSelected: Dispatch<SetStateAction<number>>
  setFilters: Dispatch<SetStateAction<{
    searchType: 'code' | 'name'
    farmerId: string
    farmerFullNames: string
    farmerSocialReason: string
    farmerType: 'Individual' | 'Asociación'
    page: number, 
    limit: number
  }>>
  setPaginationNumbers: Dispatch<SetStateAction<number[]>>
}

export default function CreateFarmerModal ({ modalFormIsOpen, setModalFormIsOpen, setPaginationSelected, setFilters, setPaginationNumbers}: Props) {

  const [projectList, setProjectList] = useState<{
    projectId: string
    projectDescription: string
    projectSectorId: number
    projectCode: number
  }[]>([])

  const [projectAddressList, setProjectAddressList] = useState<{
    projectId: string
    projectDescription: string
    projectSectorId: number
    projectCode: number
  }[]>([])

  const [farmerQualities, setFramerQualities] = useState<{ farmerQualityId: number, farmerQualityDescription: string }[]>([])
  const [propertyLegalConditions, setPropertyLegalCondition] = useState<{ propertyLegalConditionId: number, propertyLegalConditionDescription: string }[]>([])

  const [farmer, setFarmer] = useState<{
    propertySectorId: number   
    propertyProjectCode: number
    farmerQualityId: number
    farmerType: 'Individual' | 'Asociación'
    socialReason?: string
    fullNames?: string
    dni?: string
    ruc?: string
    propertyLocation: string
    propertyLegalConditionId: number
    cadastralRegistry: string
    farmerAddress: string
    farmerProjectId: number
    propertyHectareQuantity: number
  }>({ 
    propertySectorId: 0,
    propertyProjectCode: 0,
    farmerQualityId: 0,
    farmerType: 'Individual',
    propertyLocation: '',
    propertyLegalConditionId: 0,
    cadastralRegistry: '',
    farmerAddress: '',
    farmerProjectId: 0,
    propertyHectareQuantity: 0
  })

  const [createFailed, setCreateFailed] = useState('')

  const socialReasonValue = React.useRef(null)
  const fullNamesValue = React.useRef(null)
  const dniValue = React.useRef(null)
  const rucValue = React.useRef(null)
  const propertyHectareQuantityValue = React.useRef(null)
  const propertyLocationValue = React.useRef(null)
  const cadastralRegistryValue = React.useRef(null)
  const farmerAddressValue = React.useRef(null)

  const propertySectorIdValue = React.useRef(null)
  const propertyProjectCodeValue = React.useRef(null)
  const farmerQualityIdValue = React.useRef(null)
  const propertyLegalConditionIdValue = React.useRef(null)
  const farmerProjectIdValue = React.useRef(null)

  useEffect(() => {
    listFarmerAttributesServices()
      .then(({ farmerQualities, propertyLegalConditions }) => {
        setFramerQualities(farmerQualities)
        setPropertyLegalCondition(propertyLegalConditions)
      })
      .catch(error => {
        console.log(error.message)
      })
    listProjectService()
      .then(project => {
        setProjectAddressList(project)
      })
      .catch(error => {
        console.log(error.message)
      })
  }, [])

  const getValueInputs = () => {
    return {
      //@ts-ignore
      socialReason: socialReasonValue.current?.value,
      //@ts-ignore
      fullNames: fullNamesValue.current?.value,
      //@ts-ignore
      dni: dniValue.current?.value,
      //@ts-ignore
      ruc: rucValue.current?.value,
      //@ts-ignore
      propertyHectareQuantity: propertyHectareQuantityValue.current?.value,
      //@ts-ignore
      propertyLocation: propertyLocationValue.current?.value,
      //@ts-ignore
      cadastralRegistry: cadastralRegistryValue.current?.value,
      //@ts-ignore
      farmerAddress: farmerAddressValue.current?.value,
      //@ts-ignore
      propertySectorId: propertySectorIdValue.current?.value,
      //@ts-ignore
      propertyProjectCode: propertyProjectCodeValue.current?.value,
      //@ts-ignore
      farmerQualityId: farmerQualityIdValue.current?.value,
      //@ts-ignore
      propertyLegalConditionId: propertyLegalConditionIdValue.current?.value,
      //@ts-ignore
      farmerProjectId: farmerProjectIdValue.current?.value
    }
  }

  const clearInputFields = () => {
    if (farmer.farmerType === 'Individual') {
      //@ts-ignore
      fullNamesValue.current.value = ''
      //@ts-ignore
      dniValue.current.value = ''
      //@ts-ignore
      propertyHectareQuantityValue.current.value = ''
      //@ts-ignore
      propertyLocationValue.current.value = ''
      //@ts-ignore
      cadastralRegistryValue.current.value = ''
      //@ts-ignore
      farmerAddressValue.current.value = ''
      
      //@ts-ignore
      propertySectorIdValue.current.value = ''
      //@ts-ignore
      propertyProjectCodeValue.current.value = ''
      //@ts-ignore
      farmerQualityIdValue.current.value = ''
      //@ts-ignore
      propertyLegalConditionIdValue.current.value = ''
      //@ts-ignore
      farmerProjectIdValue.current.value = ''
      
    } else {
      //@ts-ignore
      socialReasonValue.current.value = ''
      //@ts-ignore
      rucValue.current.value = ''
      //@ts-ignore
      propertyHectareQuantityValue.current.value = ''
      //@ts-ignore
      propertyLocationValue.current.value = ''
      //@ts-ignore
      cadastralRegistryValue.current.value = ''
      //@ts-ignore
      farmerAddressValue.current.value = ''
      
      //@ts-ignore
      propertySectorIdValue.current.value = ''
      //@ts-ignore
      propertyProjectCodeValue.current.value = ''
      //@ts-ignore
      farmerQualityIdValue.current.value = ''
      //@ts-ignore
      propertyLegalConditionIdValue.current.value = ''
      //@ts-ignore
      farmerProjectIdValue.current.value = ''
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    if (
      event.target.name === 'propertyProjectCode' ||
      event.target.name === 'farmerQualityId' ||
      event.target.name === 'propertyLegalConditionId' ||
      event.target.name === 'farmerProjectId'
    ) {
      return setFarmer({ 
        ...farmer,
        [event.target.name]: Number(event.target.value)
      })
    }

    setFarmer({ 
      ...farmer,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCreateFailed('')
    const { 
      cadastralRegistry,
      dni,
      farmerAddress,
      fullNames,
      propertyHectareQuantity,
      propertyLocation,
      ruc,
      socialReason
    } = getValueInputs()

    if (dni && dni.length !== 8) {
      return setCreateFailed('Debe ingresa un DNI con 8 dígitos')
    } 
    
    if (ruc && ruc.length !== 10) {
      return setCreateFailed('Debe ingresa un RUC con 10 dígitos')
    }

    const farmerToSave = {
      ...farmer,
      cadastralRegistry,
      dni,
      farmerAddress,
      fullNames,
      propertyHectareQuantity: Number(propertyHectareQuantity),
      propertyLocation,
      ruc,
      socialReason
    }

    try {
      await createFramerService(farmerToSave)
      handleCancel()
    } catch (error: any) {
      setCreateFailed(error.message)
    }
  }

  const changeProjectsBySectorHandler = async (event: ChangeEvent<HTMLSelectElement>) => {
    const sectorId = event.target.value
    
    const projectsFound = await listProjectBySectorService({ sectorId: Number(sectorId) })
    setProjectList(projectsFound)
    setFarmer({ ...farmer, propertySectorId: Number(sectorId) })
  }

  const handlerChangeSetProject = async (event: ChangeEvent<HTMLSelectElement>) => {
    const projectId = event.target.value
    setFarmer({ ...farmer, propertyProjectCode: Number(projectId) })
  }

  const handlerChangeFarmerType = async (event: ChangeEvent<HTMLSelectElement>) => {
    const farmerType = event.target.value as 'Individual' | 'Asociación'
    setFarmer({ ...farmer, farmerType })
  }

  const handleCancel = () => {
    setCreateFailed('')
    clearInputFields()
    setFilters({
      searchType: 'code',
      farmerId: '',
      farmerFullNames: '',
      farmerSocialReason: '',
      farmerType: 'Individual',
      page: 1,
      limit: 6
    })
    setPaginationSelected(1)
    setPaginationNumbers([1,2,3,4,5])
    setModalFormIsOpen(false)
  }

  return (
    <Modal show={modalFormIsOpen} onClose={handleCancel}>
      <form onSubmit={handleSubmit}>
        <Modal.Header className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          Creación de agricultor
        </Modal.Header>
        <Modal.Body className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800" >
          {
            createFailed !== ''
              ? <div className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
                  <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">Algo salió mal!</span> {createFailed}
                  </div>
                </div>
              : <></>
          }   
          <div className="flex justify-between">
            <div className="mb-6 w-full mr-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sector:</label>
              <select name="propertySectorId" ref={propertySectorIdValue} onChange={changeProjectsBySectorHandler} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Elegir sector</option>
                <option value="2">2 - Margen derecha</option>
                <option value="3">3 - Tumbes</option>
                <option value="4">4 - Margen izquierda</option>
              </select>
            </div>
            <div className="mb-6 w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Proyecto:</label>
              <select name="propertyProjectCode" ref={propertyProjectCodeValue} onChange={handlerChangeSetProject} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Elegir proyecto</option>
                {
                  projectList.map(project => (
                    <option value={project.projectCode} key={project.projectId}>{project.projectCode} - {project.projectDescription}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="mb-6 w-full mr-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Calidad del agricultor:</label>
              <select name="farmerQualityId" ref={farmerQualityIdValue} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Elegir calidad</option>
                {
                  farmerQualities.map(quality => (
                    <option value={quality.farmerQualityId} key={quality.farmerQualityId}>{quality.farmerQualityDescription}</option>
                  ))
                }
              </select>
            </div>
            <div className="mb-6 w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tipo de agricultor:</label>
              <select name="farmerType" onChange={handlerChangeFarmerType} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="Individual">Individual</option>
                <option value="Asociación">Asociación</option>
              </select>
            </div>
          </div>
          {
            farmer.farmerType === 'Individual'
              ? (
                <>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombres completos:</label>
                    <input type="text" name="fullNames" ref={fullNamesValue} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Fabricio Pulache Aponcio" required />
                  </div>
                  <div className="flex justify-between">
                    <div className="mb-6 w-full mr-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">DNI:</label>
                      <input type="number" name="dni" ref={dniValue} maxLength={8} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="12345678" required />
                    </div>
                    <div className="mb-6 w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cantidad de hectáreas:</label>
                      <input type="number" name="propertyHectareQuantity" ref={propertyHectareQuantityValue} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="10" required />
                    </div>
                  </div>
                </>
              )
              : 
              (
                <>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Razón social:</label>
                    <input type="text" name="socialReason" ref={socialReasonValue} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="RAZON SOCIAL S.A." required />
                  </div>
                  <div className="flex justify-between">
                    <div className="mb-6 w-full mr-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">RUC:</label>
                      <input type="number" name="ruc" ref={rucValue} maxLength={10} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="1234567890" required />
                    </div>
                    <div className="mb-6 w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cantidad de hectáreas:</label>
                      <input type="number" name="propertyHectareQuantity" ref={propertyHectareQuantityValue} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="10" required />
                    </div>
                  </div>
                </>
              )
          }
          <div className="flex justify-between">
            <div className="mb-6 w-full mr-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ubicación del predio:</label>
              <input type="text" name="propertyLocation" ref={propertyLocationValue} className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Mz G Lt 1 AAHH Pampa Grande" required />
            </div>
            <div className="mb-6 w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Condición juridica:</label>
              <select name="propertyLegalConditionId" ref={propertyLegalConditionIdValue} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Elegir condición</option>
                {
                  propertyLegalConditions.map(legalCondition => (
                    <option value={legalCondition.propertyLegalConditionId} key={legalCondition.propertyLegalConditionId}>{legalCondition.propertyLegalConditionDescription}</option>
                  ))
                }
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Registro catastral:</label>
            <input type="text" name="cadastralRegistry" ref={cadastralRegistryValue} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="374847984793WW" required />
          </div>
          <div className="flex justify-between">
            <div className="mb-6 w-full mr-4">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Domicilio:</label>
              <input type="text" name="farmerAddress" ref={farmerAddressValue} className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Av. Tumbes 209" required />
            </div>
            <div className="mb-6 w-full">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Distrito del domicilio:</label>
              <select name="farmerProjectId" ref={farmerProjectIdValue} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                <option value="">Elegir distrito</option>
                {
                  projectAddressList.map(projectAddress => (
                    <option value={projectAddress.projectId} key={projectAddress.projectId}>{projectAddress.projectDescription}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <Button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
            type="submit"
          >
            Crear agricultor
          </Button>
          <Button
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}