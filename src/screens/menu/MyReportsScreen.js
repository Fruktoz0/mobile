import { Text, StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState, useEffect } from 'react'
import { List } from 'react-native-paper';
import {
  FileWarning,
  CalendarDays,
  Tag,
  CircleAlert,
  MapPin,
  FileText,
} from 'lucide-react-native';
import { fetchUserReports } from '../../services/reportService';

const statusLabels = {
  open: "Függőben",
  in_progress: "Folyamatban",
  rejected: "Elutasítva",
  resolved: "Megoldva"
}

const statusColors = {
  open: '#F9A825',
  in_progress: 'black',
  resolved: '#388E3C',
  rejected: '#D32F2f'
}


const MyReportsScreen = () => {

  const navigation = useNavigation()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchUserReports();
        setReports(data);
      } catch (error) {
        console.error("Hiba a bejelentések lekérdezésekor:", error)
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#6BAEA1" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
            <Text style={styles.backText}>Bejelentéseim</Text>
          </TouchableOpacity>
        </View>
        <View >
          {reports.length === 0 ? (
            <Text style={styles.noReports}>Még nincs bejelentésed.</Text>
          ) : (
            reports.map((report) => (
              <List.Accordion
                key={report.id}
                style={styles.accordion}
                title={
                  <View>
                    <Text style={styles.title}>{report.title}</Text>
                    <Text style={styles.date}>{new Date(report.createdAt).toLocaleDateString('hu-HU')}</Text>
                    <Text style={{color: statusColors[report.status], fontWeight: '600' }}>{statusLabels[report.status]}</Text>
                    
                  </View>
                }
                left={() => <FileWarning size={24} color="#6BAEA1" style={{marginStart: 10}}/>}
              >
                <View style={styles.accordionContent}>
                  {/* Kategória */}
                  <View style={styles.detailRow}>
                    <Tag size={18} color="#555" />
                    <Text style={styles.detailLabel}>Kategória:</Text>
                    <Text style={styles.detailValue}>
                      {report.category?.categoryName || '–'}
                    </Text>
                  </View>

                  {/* Státusz */}
                  <View style={styles.detailRow}>
                    <CircleAlert size={18} color={statusColors[report.status]} />
                    <Text style={styles.detailLabel}>Státusz:</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        { color: statusColors[report.status] },
                      ]}
                    >
                      {statusLabels[report.status]}
                    </Text>
                  </View>

                  {/* Lokáció */}
                  {report.locationLat && report.locationLng && (
                    <View style={styles.detailRow}>
                      <MapPin size={18} color="#555" />
                      <Text style={styles.detailLabel}>Lokáció:</Text>
                      <Text style={styles.detailValue}>
                        {report.locationLat.toFixed(4)}, {report.locationLng.toFixed(4)}
                      </Text>
                    </View>
                  )}

                  {/* Leírás */}
                  {report.description && (
                    <View style={[styles.detailRow, { alignItems: 'flex-start' }]}>
                      <FileText size={18} color="#555" style={{ marginTop: 3 }} />
                      <Text style={styles.detailLabel}>Leírás:</Text>
                      <Text style={styles.detailValue}>{report.description}</Text>
                    </View>
                  )}
                </View>
              </List.Accordion>
            ))
          )}
        </View>




      </View>
    </ScrollView>

  )
}

export default MyReportsScreen

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 8,
  },
  header: {
    marginStart: 16,
    paddingTop: 32,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF8'
  },

  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
  },
  noReports: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  accordion: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  date: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  accordionContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: '600',
    marginLeft: 4,
  },
  detailValue: {
    flexShrink: 1,
  },

})