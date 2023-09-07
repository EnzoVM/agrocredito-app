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

export default function DeliveryGenenalDocument ({ deliveries, campaignId }: { deliveries: {
    deliveryId: number
    campaignId: string
    fullNames?: string
    socialReason?: string
    deliveryDateTime: Date
    providerDescription: string
    financialSourceDescription: string
    currentAccountDescription: string
    gloss: string
    deliveryAmount: number
  }[], 
  campaignId: string
}) {

  return (
    <Document>
    <Page style={styles.body}>
      <Text style={styles.textLogo}>AgroCredito PEBPT</Text>
      <Text style={styles.text}>Reporte de entregas</Text>
      <Text style={styles.textSecondary}>Las entregas mostradas a continuación son de la campaña {campaignId}.</Text>
      {
        deliveries.length === 0
          ? <Text style={styles.textNotFound}>No existen entregas para la campaña {campaignId}</Text>
          : <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Código de la entrega</Text>
                </View> 
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Nombres / Razón social:</Text>
                </View> 
                <View style={styles.tableCol}> 
                  <Text style={styles.tableCell}>Fecha de la entrega:</Text> 
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Proveedor:</Text>
                </View> 
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Fuente financiera:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Cuenta corriente:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Glosa:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Monto entregado:</Text>
                </View>
              </View>
              {
                deliveries.map(delivery => (
                  <View key={delivery.deliveryId} style={styles.tableRow}> 
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{delivery.deliveryId}</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{delivery.fullNames || delivery.socialReason}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{moment(delivery.deliveryDateTime).format('LLLL')}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{delivery.providerDescription}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{delivery.financialSourceDescription}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{delivery.currentAccountDescription}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{delivery.gloss}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{(delivery.deliveryAmount).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</Text> 
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