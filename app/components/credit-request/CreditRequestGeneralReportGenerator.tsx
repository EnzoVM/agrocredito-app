'use client'

import { useEffect, useState } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import CreditRequestGeneralDocument from './CreditRequestGeneralDocument'
import { listCreditRequestService } from '@/services/credit.request.service'
import { Button } from 'flowbite-react'

export default function CreditRequestGeneralReportGenerator ({ campaignId }: { campaignId: string }) {

  const [creditRequestsReport, setCreditRequestsReport] = useState<{
    creditRequestId: string
    campaignId: string
    fullNames?: string
    socialReason?: string
    creditAmount: number
    createDateTime: Date
    updateStatusDateTime?: Date
    creditRequestStatus: string
  }[]>([])

  useEffect(() => {
    listCreditRequestService({
      campaignId,
      farmerType: 'All',
      creditRequestStatus: 'Pendiente',
      page: 1,
      limit: 0
    })
      .then(response => {
        setCreditRequestsReport(response.creditRequests)
      })
      .catch(error => console.log(error))
  }, [campaignId])

  return (
    <PDFDownloadLink document={<CreditRequestGeneralDocument creditRequests={creditRequestsReport} />} fileName={`${campaignId}.pdf`} >
      <Button
        className="text-white mb-6 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
      >
        Reporte de solicitudes de créditos pendientes
      </Button>
    </PDFDownloadLink>
  )
}