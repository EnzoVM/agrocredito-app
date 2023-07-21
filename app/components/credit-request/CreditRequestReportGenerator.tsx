'use client'

import { useEffect, useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import CreditRequestDocument from './CreditRequestDocument'
import { getCreditRequestService } from '@/services/credit.request.service'

export default function CreditRequestReportGenerator ({ creditRequestId }: { creditRequestId: string }) {

  const [creditRequestDetail, setCreditRequestDetail] = useState<{
    creditRequestId: string
    farmerId: string
    farmerFullNames?: string
    farmerSocialReason?: string
    campaignId: string
    hectareNumber: number
    creditReason: string
    creditAmount: number
    guaranteeDescription: string
    guaranteeAmount: number
    technicalName: string
    assistanceTypeDescription: string
    creditRequestStatus: string
    creditRequestObservation: string
    createDateTime: Date
    updateStatusDateTime?: Date
  }>({
    creditRequestId: '',
    farmerId: '',
    farmerFullNames: '',
    campaignId: '',
    hectareNumber: 0,
    creditReason: '',
    creditAmount: 1000,
    guaranteeDescription: '',
    guaranteeAmount: 0,
    technicalName: '',
    assistanceTypeDescription: '',
    creditRequestStatus: '',
    creditRequestObservation: '',
    createDateTime: new Date()
  })
  
  useEffect(() => {
    getCreditRequestService({ creditRequestId })
    .then(response => {
      setCreditRequestDetail(response)
    })
    .catch(error => {
      console.log(error)
    })
  }, [creditRequestId])

  return (
    <PDFDownloadLink document={<CreditRequestDocument creditRequestData={creditRequestDetail} />} fileName={`${creditRequestDetail.farmerId}_${creditRequestDetail.farmerFullNames?.split(' ').join('_') || creditRequestDetail.farmerSocialReason?.split(' ').join('_')}_${creditRequestDetail.createDateTime}_${creditRequestDetail.creditRequestId}.pdf`} >
      <button className="px-3 py-2 text-xs font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
        Generar reporte
      </button>
    </PDFDownloadLink>
  )
}