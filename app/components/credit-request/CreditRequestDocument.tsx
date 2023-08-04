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
  textLogo: {
    marginBottom: 20,
    fontSize: 14
  },
  textSecondary: {
    marginBottom: 10,
    fontSize: 15
  },
  table: {
    width: "auto", 
    borderStyle: "solid",
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0,
    marginLeft: "30px",
    marginRight: "30px",
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
    fontSize: 12
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

export default function CreditRequestDocument ({ creditRequestData }: { creditRequestData: {
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
} }) {

  return (
    <Document>
      <Page style={styles.body} size='A4'>
        <Text style={styles.textLogo}>AgroCredito PEBPT</Text>
        <Text style={styles.text}>Reporte de la solicitud de crédito</Text>
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Estado de la solicitud:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{creditRequestData.creditRequestStatus}</Text> 
            </View>
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Campaña:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{creditRequestData.campaignId}</Text> 
            </View>
          </View> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Agricultor:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{creditRequestData.farmerId} - {creditRequestData.farmerFullNames || creditRequestData.farmerSocialReason}</Text> 
            </View>
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Cantidad de hectáreas:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{creditRequestData.hectareNumber}</Text> 
            </View>
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Monto del crédito:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>${creditRequestData.creditAmount}</Text> 
            </View>
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Razón del crédito:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{creditRequestData.creditReason}</Text> 
            </View>
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Garantía:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{creditRequestData.guaranteeDescription}</Text> 
            </View>
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Valor de la garantía:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>${creditRequestData.guaranteeAmount}</Text> 
            </View>
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Tipo de asistencia:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{creditRequestData.assistanceTypeDescription}</Text> 
            </View>
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Nombre del técnico:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{creditRequestData.technicalName}</Text> 
            </View>
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Observaciones:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{creditRequestData.creditRequestObservation}</Text> 
            </View>
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Fecha de solicitud del crédito:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{moment(creditRequestData.createDateTime).format('LLLL')}</Text> 
            </View>
          </View>
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Fecha de modificación del estado de la solicitud:</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>{creditRequestData.updateStatusDateTime ? moment(creditRequestData.updateStatusDateTime).format('LLLL') : 'Sin modificaciones'}</Text> 
            </View>
          </View>
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  )
} 