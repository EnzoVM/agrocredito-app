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

export default function CreditRequestGenenalDocument ({ creditRequests, campaignId }: { creditRequests: {
    creditRequestId: string
    campaignId: string
    fullNames?: string
    socialReason?: string
    creditAmount: number
    createDateTime: Date
    updateStatusDateTime?: Date
    creditRequestStatus: string
  }[], 
  campaignId: string
}) {

  return (
    <Document>
    <Page style={styles.body}>
      <Text style={styles.textLogo}>AgroCredito PEBPT</Text>
      <Text style={styles.text}>Reporte de la solicitud de crédito</Text>
      <Text style={styles.textSecondary}>Las solicitudes de crédito mostradas en el presente reporte son las que poseen como estado pendiente de aprobación para la campaña {campaignId}.</Text>
      
      {
        creditRequests.length === 0
          ? <Text style={styles.textNotFound}>No existen solicitudes de crédito pendientes para la campaña {campaignId}</Text>
          : <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Código de la campaña</Text>
                </View> 
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Nombres / Razón social:</Text>
                </View> 
                <View style={styles.tableCol}> 
                  <Text style={styles.tableCell}>Monto del crédito</Text> 
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Fecha de la solicitud:</Text>
                </View> 
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Estado de la solicitud:</Text>
                </View>
              </View>
              {
                creditRequests.map(creditRequest => (
                  <View key={creditRequest.creditRequestId} style={styles.tableRow}> 
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{creditRequest.campaignId}</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{creditRequest.fullNames || creditRequest.socialReason}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{creditRequest.creditAmount}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{moment(creditRequest.createDateTime).format('LLLL')}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{creditRequest.creditRequestStatus}</Text> 
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