import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
import path from 'path';
import os from 'os'

export const startBuyingProcess = () => {
    console.log("start buying process");

    const desktopPath = path.join(os.homedir(), 'Desktop');
    const filePath = path.join(desktopPath, 'example.pdf');

    // ReactPDF.render(<TestPDFBill />, filePath)
   
    
}

type Props = {
    userName : string
}

export const TestPDFBill =(props : Props) => (
        <Document>
            <Page size={"A4"}>
                <View>
                    <Text>Facture blockchain team de {props.userName}</Text>
                </View>
            </Page>

        </Document>
)