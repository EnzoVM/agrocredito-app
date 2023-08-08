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
    textAlign: "center",
    marginBottom: 10,
    fontSize: 12
  },
  table: {
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

export default function PaymentGenenalDocument ({ payments, campaignId }: { payments: {
    paymentId: number
    socialReason?: string
    fullNames?: string
    paymentDateTime: Date
    financialSourceDescription: string
    currentAccountDescription: string
    paymentDescription: string
    paymentAmount: number
  }[], 
  campaignId: string
}) {

  return (
    <Document>
    <Page style={styles.body}>
      <Text style={styles.textLogo}>AgroCredito PEBPT</Text>
      <Text style={styles.text}>Reporte de abonos</Text>
      <Text style={styles.textSecondary}>Los abonos mostrados a continuación pertenecen a la campaña {campaignId}.</Text>
      {
        payments.length === 0
          ? <Text style={styles.textNotFound}>No existen abonos para la campaña {campaignId}</Text>
          : <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Código del abono</Text>
                </View> 
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Nombres / Razón social:</Text>
                </View> 
                <View style={styles.tableCol}> 
                  <Text style={styles.tableCell}>Fecha del abono:</Text> 
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Fuente financiera:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Cuenta corriente:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Descripción:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Monto abonado:</Text>
                </View>
              </View>
              {
                payments.map(payment => (
                  <View key={payment.paymentId} style={styles.tableRow}> 
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{payment.paymentId}</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{payment.fullNames || payment.socialReason}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{moment(payment.paymentDateTime).format('LLLL')}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{payment.financialSourceDescription}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{payment.currentAccountDescription}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{payment.paymentDescription}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>${payment.paymentAmount}</Text> 
                    </View>
                  </View>
                ))
              }
            </View>
      }
      
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
    </Page>
  </Document>
  )
} 