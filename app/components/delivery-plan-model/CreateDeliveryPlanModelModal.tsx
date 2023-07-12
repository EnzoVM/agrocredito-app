import { createDeliveryPlanModelService } from "@/services/delivery.plan.model.service";
import { createDepartureDetailService } from "@/services/departure.detail.service";
import { Button, Modal } from "flowbite-react";
import React, { Dispatch, SetStateAction } from "react";
import { FormEvent} from "react";

interface Props {
  modalFormIsOpen: boolean
  setModalFormIsOpen: (modalFormIsOpen: boolean) => void
  setErrorMessage: Dispatch<SetStateAction<string>>
  campaignId: string
  deliveryPlanModelId: number
  typeOfCore: string
  setIsLoadding: Dispatch<SetStateAction<boolean>>

  setDeliveryPlanModel: Dispatch<SetStateAction<{
    deliveryPlanModelId: number;
    campaignId: string;
    deliveryPlanModelDescription: string;
  }>>
  listDepartureDetail: {
    departureDetailId: number;
    deliveryPlanModelId: number;
    departureDetailDescription: string;
    departureType: string;
    resource: string;
    amountPerHectare: number;
  }[]
  setListDepartureDetail: Dispatch<SetStateAction<{
    departureDetailId: number;
    deliveryPlanModelId: number;
    departureDetailDescription: string;
    departureType: string;
    resource: string;
    amountPerHectare: number;
  }[]>>
}

export default function CreateDeliveryPlanModelModal ({
  modalFormIsOpen, 
  setModalFormIsOpen, 
  campaignId, 
  setDeliveryPlanModel, 
  setErrorMessage, 
  typeOfCore, 
  listDepartureDetail, 
  setListDepartureDetail,
  deliveryPlanModelId,
  setIsLoadding
}: Props) {

  const deliveryPlanModelDescriptionValue = React.useRef(null)
  const departureDetailDescriptionValue = React.useRef(null)
  const departureDetailTypeValue = React.useRef(null)
  const departureDetailAmountPerHectareValue = React.useRef(null)

  const clearInputFields = () => {
    if(typeOfCore === 'DeliveryPlanModel'){
      //@ts-ignore
      deliveryPlanModelDescriptionValue.current.value=''
    } else {
      //@ts-ignore
      departureDetailDescriptionValue.current.value=''
      //@ts-ignore
      departureDetailTypeValue.current.value=''
      //@ts-ignore
      departureDetailAmountPerHectareValue.current.value=''
    }
  }

  const getValueInputs = () => {
    if(typeOfCore === 'DeliveryPlanModel'){
      return {
        //@ts-ignore
        deliveryPlanModelDescription: deliveryPlanModelDescriptionValue.current?.value,
      }
    } else {
      return {
        //@ts-ignore
        departureDetailDescription: departureDetailDescriptionValue.current?.value,
        //@ts-ignore
        departureDetailType: departureDetailTypeValue.current?.value,
        //@ts-ignore
        departureDetailAmountPerHectare: departureDetailAmountPerHectareValue.current?.value,
      }
    }
  }

  const handleCancel = () => {
    setModalFormIsOpen(false)
    clearInputFields()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setModalFormIsOpen(false)
    setIsLoadding(true)

    if(typeOfCore === 'DeliveryPlanModel'){
      const deliveryPlanModelDescription: string = getValueInputs().deliveryPlanModelDescription
      createDeliveryPlanModelService({
        campaignId,
        deliveryPlanModelDescription
      }).then(response => {
        setDeliveryPlanModel({
          deliveryPlanModelId: response.deliveryPlanModelId,
          campaignId: response.campaignId,
          deliveryPlanModelDescription: response.deliveryPlanModelDescription
        })
        setErrorMessage('')
        clearInputFields()
        setIsLoadding(false)
      }).catch(error => {
        console.log(error.message)
        clearInputFields()
        setIsLoadding(false)
      })

    } else {
      const departureDetailDescription: string = getValueInputs().departureDetailDescription
      const departureType: string = getValueInputs().departureDetailType
      const amountPerHectare: number = Number(getValueInputs().departureDetailAmountPerHectare)
      
      createDepartureDetailService({
        deliveryPlanModelId,
        departureDetailDescription,
        departureType,
        amountPerHectare
      }).then(response => {
        setListDepartureDetail([... listDepartureDetail, {
          departureDetailId: response.departureDetailId,
          deliveryPlanModelId: response.deliveryPlanModelId,
          departureDetailDescription: response.departureDetailDescription,
          departureType: response.departureType,
          resource: response.resource,
          amountPerHectare: response.amountPerHectare
        }])
        clearInputFields()
        setIsLoadding(false)
      }).catch(error => {
        console.log(error.message)
        clearInputFields()
        setIsLoadding(false)
      })
    }
  }

  return (
    <Modal show={modalFormIsOpen} onClose={() => setModalFormIsOpen(false)}>
      <form onSubmit={handleSubmit}>
        <Modal.Header className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          {
            typeOfCore === 'DeliveryPlanModel' 
            ? 'Creación del modelo de plan de entregas' 
            : 'Creación de una partida'
          }
        </Modal.Header>
        <Modal.Body className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800" >
          {
            typeOfCore === 'DeliveryPlanModel'
            ?
              <div className="mb-2">
                <label className="block mb-3 text-sm font-medium text-gray-900 dark:text-white">Descripcion del modelo</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                  placeholder="Ingrese la descripción del modelo"
                  ref={deliveryPlanModelDescriptionValue}
                  required
                />
              </div>
            :
              <>
                <div className="mb-6">
                  <label className="block mb-3 text-sm font-medium text-gray-900 dark:text-white">Descripcion de la partida</label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Ingrese la descripción de la partida"
                    ref={departureDetailDescriptionValue}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-3 text-sm font-medium text-gray-900 dark:text-white">Tipo de partida</label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Ingrese el tipo de partida"
                    ref={departureDetailTypeValue}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-3 text-sm font-medium text-gray-900 dark:text-white">Monto por hectarea</label>
                  <input
                    type="number"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Ingrese el monto por hectarea"
                    ref={departureDetailAmountPerHectareValue}
                    required
                  />
                </div>
              </>
          }
        </Modal.Body>
        <Modal.Footer className="border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <Button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
            type="submit"
          >
          {
            typeOfCore === 'DeliveryPlanModel' 
            ? 'Crear modelo' 
            : 'Crear partida'
          }
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