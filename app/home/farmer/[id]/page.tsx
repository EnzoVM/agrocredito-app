'use client'

import { getFarmerDetailsService, updateFarmerService } from "@/services/farmer.service"
import { listProjectService } from "@/services/project.service"
import { ChangeEvent, useEffect, useState } from "react"

export default function FarmerDetail ({ params }: { params: { id: string }}) {

  const [farmerDetail, setFarmerDetail] = useState<{
    farmerId: string                     
    propertySector: string   
    propertyProject: string
    correlative: number
    farmerQuality: string
    farmerType: 'Individual' | 'Asociación'
    socialReason?: string
    fullNames?: string
    dni?: string
    ruc?: string
    propertyLocation: string
    propertyLegalCondition: string
    cadastralRegistry: string
    farmerAddress: string
    farmerProject: string
    propertyHectareQuantity: number
  }>({
    cadastralRegistry: '',
    correlative: 0,
    farmerAddress: '',
    farmerId: '',
    farmerProject: '',
    farmerQuality: '',
    farmerType: 'Individual',
    propertyHectareQuantity: 0,
    propertyLegalCondition: '',
    propertyLocation: '',
    propertyProject: '',
    propertySector: '',
    dni: '',
    fullNames: ''
  })

  const [projectList, setProjectList] = useState<{
    projectId: string
    projectDescription: string
    projectSectorId: number
    projectCode: number
  }[]>([])

  const [errorMessage, setErrorMessage] = useState<string>() 
  const [editable, setEditable] = useState<{
    editPersonalData: boolean
    editPropertyData: boolean
  }>({
    editPersonalData: false,
    editPropertyData: false
  })

  const [dataToEdit, setDataToEdit] = useState<{
    farmerId: string, 
    farmerAddress?: string, 
    farmerProjectId?: number, 
    hectareQuantity?: number
  }>({
    farmerId: ''
  })

  useEffect(() => {
    getFarmerDetailsService({ id: params.id })
      .then(response => {
        setFarmerDetail(response)
        setDataToEdit({ ...dataToEdit, farmerId: response.farmerId })
      })
      .catch(error => {
        setErrorMessage(error.message)
      })
  }, [params])

  const handlerChangeSetProject = (event: ChangeEvent<HTMLSelectElement>) => {
    const projectId = event.target.value
    setDataToEdit({ ...dataToEdit, farmerProjectId: Number(projectId)})
  }

  const handleChangeFarmerAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setDataToEdit({
      ...dataToEdit,
      [event.target.name]: event.target.value
    })
  }

  const handleChangeHectareQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    setDataToEdit({
      ...dataToEdit,
      [event.target.name]: Number(event.target.value)
    })
  }

  const handleEditPersonalData = async () => {
    if (projectList.length === 0) {
      listProjectService()
      .then(project => {
        setProjectList(project)
      })
      .catch(error => {
        console.log(error.message)
      })
    }
    if (editable.editPersonalData === true) {
      await updateFarmerService(dataToEdit)
      getFarmerDetailsService({ id: params.id })
        .then(response => {
          setFarmerDetail(response)
          setDataToEdit({ ...dataToEdit, farmerId: response.farmerId })
        })
        .catch(error => {
          setErrorMessage(error.message)
        })
    }
    
    setFarmerDetail({ ...farmerDetail, ...dataToEdit })
    setEditable({ ...editable, editPersonalData: !editable.editPersonalData})
  }

  const handleEditPropertyData = async () => {
    setEditable({ ...editable, editPropertyData: !editable.editPropertyData})

    if (editable.editPropertyData === true) {
      await updateFarmerService(dataToEdit)

      getFarmerDetailsService({ id: params.id })
        .then(response => {
          setFarmerDetail(response)
          setDataToEdit({ ...dataToEdit, farmerId: response.farmerId })
        })
        .catch(error => {
          setErrorMessage(error.message)
        })
    }
  }

  return (
    <div>
      <div className="md:h-screen dark:bg-gray-900">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 pt-20">
          <p className="text-3xl font-bold text-gray-100 p-6 text-center">Detalle del agricultor {farmerDetail.fullNames ? farmerDetail.fullNames : farmerDetail.socialReason}</p>
          <div className="flex justify-between">
            <div className="block w-full mr-2 p-6 bg-white border border-gray-700 rounded-lg dark:bg-gray-800">
              <div className="flex justify-between mb-4">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Datos personales:</h5>
                <button type="button" onClick={handleEditPersonalData} className="px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{editable.editPersonalData ? 'Guardar' : 'Editar'}</button>
              </div>
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Código:</p>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">2.3.4</p>
              {
                farmerDetail.farmerType === 'Individual'
                  ? 
                  (
                    <>
                      <p className="text-md tracking-tight text-gray-900 dark:text-white">Nombres completos:</p>
                      <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.fullNames}</p>
                      <p className="text-md tracking-tight text-gray-900 dark:text-white">DNI:</p>
                      <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.dni}</p>
                    </>
                  )
                  :
                  (
                    <>
                      <p className="text-md tracking-tight text-gray-900 dark:text-white">Razón social:</p>
                      <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.socialReason}</p>
                      <p className="text-md tracking-tight text-gray-900 dark:text-white">RUC:</p>
                      <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.ruc}</p>
                    </>
                  )
              }
              {
                editable.editPersonalData
                  ? 
                  (
                    <>
                      <div className="flex justify-between">
                        <div className="mb-4 w-full mr-4">
                          <p className="text-md tracking-tight text-gray-900 dark:text-white">Ubicación del domicilio:</p>
                          <input type="text" name="farmerAddress" value={dataToEdit.farmerAddress} onChange={handleChangeFarmerAddress} className="shadow-sm w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="Av. Tumbes 209" required />
                        </div>
                        <div className="mb-4 w-full">
                          <p className="text-md tracking-tight text-gray-900 dark:text-white">Distrito del domicilio:</p>
                          <select name="farmerProjectId" value={dataToEdit.farmerProjectId} onChange={handlerChangeSetProject} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
                            <option value="">Elegir distrito</option>
                            {
                              projectList.map(project => (
                                <option value={project.projectId} key={project.projectId}>{project.projectDescription}</option>
                              ))
                            }
                          </select>
                        </div>
                      </div>
                    </>
                  )
                  :
                  (
                    <>
                      <p className="text-md tracking-tight text-gray-900 dark:text-white">Domicilio:</p>
                      <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.farmerAddress} - {farmerDetail.farmerProject}</p>      
                    </>
                  )
              }
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Tipo de agricultor:</p>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.farmerType}</p>
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Calidad de agricultor:</p>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.farmerQuality}</p>
            </div>
            <div className="block w-full mr-2 p-6 bg-white border border-gray-700 rounded-lg dark:bg-gray-800">
              <div className="flex justify-between mb-4">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Datos del predio:</h5>
                <button type="button" onClick={handleEditPropertyData} className="px-3 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{editable.editPropertyData ? 'Guardar' : 'Editar'}</button>
              </div>
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Sector:</p>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.propertySector}</p>
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Ubicacion del predio:</p>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.propertyLocation} - {farmerDetail.propertyProject}</p>
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Condición jurídica:</p>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.propertyLegalCondition}</p>
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Registro catastral:</p>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.cadastralRegistry}</p>
              <p className="text-md tracking-tight text-gray-900 dark:text-white">Cantidad de hectáreas:</p>
              {
                editable.editPropertyData
                  ?
                  (
                    <div className="mb-4 mr-4">
                      <input type="number" value={dataToEdit.hectareQuantity} name="hectareQuantity" onChange={handleChangeHectareQuantity} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="10"/>
                    </div>
                  )
                  :
                  (
                    <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{farmerDetail.propertyHectareQuantity}</p>
                  )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}