import { Document, Text, Page, View, StyleSheet } from '@react-pdf/renderer'
import moment from 'moment'
import 'moment/locale/es'

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  text: {
    textAlign: "center",
    marginBottom: 20
  },
  textNotFound: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 50
  },
  textLogo: {
    marginBottom: 20,
    fontSize: 14
  },
  textSecondary: {
    fontSize: 14
  },
  textTerceriary: {
    textAlign: "center",
    fontSize: 12,
    paddingBottom: 10
  },
  table: {
    marginTop: '10',
    marginBottom: '10',
    width: "auto", 
    borderStyle: "solid",
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0,
    textAlign: "center"
  }, 
  tableRow: {
    flexDirection: "row" 
  }, 
  tableCol: { 
    width: "100%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  tableCell: { 
    marginTop: 10, 
    marginBottom: 10,
    marginLeft: 5, 
    fontSize: 11
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

export default function AccountStatusDocument ({ accountStatus }: { accountStatus: {
  campaignFinishDate: '',
  amountDelivered: 0,
  amountDeliveredPercentage: 0,
  creditAmount: 0,
  delinquentInterest: 0,
  delinquentInterestPercentage: 0,
  finalDebt: 0,
  interest: 0,
  interesPercentage: 0,
  payments: {
    transactionDateTime: Date,
    paymentAmount: number
  }[],
  deliveries: {
    deliveryDateTime: Date, deliveryAmount: number
  }[],
  totalPayment: 0,
  farmerData: {
    farmerId: string,
    fullNames?: string,
    socialReason?: string,
  }
  campaignId: string,
  creditRequesId: string
  }
}) {

  return (
    <Document>
    <Page style={styles.body}>
      <Text style={styles.textLogo}>AgroCredito PEBPT</Text>
      <Text style={styles.text}>Reporte de estado de cuenta</Text>
      <Text style={styles.textTerceriary}>Estado de cuenta de la solicitud de credito {accountStatus.creditRequesId}, perteneciente al agricultor {accountStatus.farmerData.farmerId} - {accountStatus.farmerData.fullNames || accountStatus.farmerData.socialReason} para la campaña {accountStatus.campaignId}</Text>
      <Text style={styles.textSecondary}>Detalle del estado de cuenta:</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Fecha de vencimiento:</Text>
          </View> 
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>{accountStatus.campaignFinishDate}</Text>
          </View> 
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Total de crédito aprobado:</Text>
          </View> 
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>${accountStatus.creditAmount}</Text>
          </View> 
        </View>
        <View  style={styles.tableRow}> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>Interés ({accountStatus.interesPercentage}%):</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>${accountStatus.interest}</Text> 
          </View>
        </View>
        <View  style={styles.tableRow}> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>Interés moratorio ({accountStatus.delinquentInterestPercentage}%):</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>${accountStatus.delinquentInterest}</Text> 
          </View>
        </View>
        <View  style={styles.tableRow}> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>Total abonado:</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>${accountStatus.totalPayment}</Text> 
          </View>
        </View>
        <View  style={styles.tableRow}> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>Deuda actual:</Text> 
          </View> 
          <View style={styles.tableCol}> 
            <Text style={styles.tableCell}>${accountStatus.finalDebt}</Text> 
          </View>
        </View>
      </View>
      
      <Text style={styles.textSecondary}>Detalle de entregas:</Text>
      
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>FECHA DE ENTREGA</Text>
          </View> 
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>MONTO ENTREGADO</Text>
          </View> 
        </View>
        {
          accountStatus.deliveries.map(delivery => (
            <View key={`${delivery.deliveryDateTime}_${delivery.deliveryAmount}`} style={styles.tableRow}> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{moment(delivery.deliveryDateTime).format('LLLL')}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>${delivery.deliveryAmount}</Text> 
              </View>
            </View>
          ))
        }
      </View>
      <Text style={styles.textSecondary}>Detalle de abonos:</Text>
      
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>FECHA DE ABONO</Text>
          </View> 
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>MONTO ABONADO</Text>
          </View> 
        </View>
        {
          accountStatus.payments.map(payment => (
            <View key={`${payment.transactionDateTime}_${payment.paymentAmount}`} style={styles.tableRow}> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{moment(payment.transactionDateTime).format('LLLL')}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>${payment.paymentAmount}</Text> 
              </View>
            </View>
          ))
        }
      </View>
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
    </Page>
  </Document>
  )
} 