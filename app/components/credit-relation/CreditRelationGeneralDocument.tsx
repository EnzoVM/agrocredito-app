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

export default function CreditRelationGenenalDocument ({ creditRelations, campaignId }: { creditRelations: {
    creditRequestId: string
    farmerId: string
    fullNames?: string
    socialReason?: string
    totalDelivery: number
    interest: number
    delinquentInterest: number
    capital: number
  }[], 
  campaignId: string
}) {

  return (
    <Document>
    <Page style={styles.body}>
      <Text style={styles.textLogo}>AgroCredito PEBPT</Text>
      <Text style={styles.text}>Relación de créditos</Text>
      <Text style={styles.textSecondary}>Relación de créditos generado para la campaña: {campaignId} con fecha: {moment(new Date()).format('LLLL')}.</Text>
      {
        creditRelations.length === 0
          ? <Text style={styles.textNotFound}>No existen solicitudes de crédito para la campaña {campaignId}</Text>
          : <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Código del agricultor</Text>
                </View> 
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Nombres / Razón social:</Text>
                </View> 
                <View style={styles.tableCol}> 
                  <Text style={styles.tableCell}>Saldo capital:</Text> 
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Interés general:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Interés moratorio:</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>Saldo:</Text>
                </View>
              </View>
              {
                creditRelations.map(creditRelation => (
                  <View key={creditRelation.creditRequestId} style={styles.tableRow}> 
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{creditRelation.farmerId}</Text> 
                    </View> 
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{creditRelation.fullNames || creditRelation.socialReason}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{(creditRelation.totalDelivery).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{(creditRelation.interest).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{(creditRelation.delinquentInterest).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</Text> 
                    </View>
                    <View style={styles.tableCol}> 
                      <Text style={styles.tableCell}>{(creditRelation.capital).toLocaleString('es-US', { style: 'currency', currency: 'USD' })}</Text> 
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