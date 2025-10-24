import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FontAwesome6 } from '@expo/vector-icons';


const screenWidth = Dimensions.get('window').width;

interface Stats {
  totalCompleted: number;
  totalEfficiency: number;
  weekCompleted: number;
  weekEfficiency: number;
  totalTasks: number;
  completed: number;
  pending: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

const mockStats: Stats = {
  totalCompleted: 110,
  totalEfficiency: 80,
  weekCompleted: 7,
  weekEfficiency: 90,
  totalTasks: 120,
  completed: 110,
  pending: 10,
  highPriority: 22,
  mediumPriority: 38,
  lowPriority: 60,
};

const AnalysisScreen: React.FC = () => {
  const colorScheme = 'dark';
  const colors = Colors[colorScheme];

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 8,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.tint,
    },
  };

  const barChartData = {
    labels: ['Sen', 'Sel', 'Rab', 'kam', 'Jum', 'Sab', 'Min'],
    datasets: [
      {
        data: [5, 4, 3, 5, 6, 7, 9],
        colors: [
          () => "#dc3545",
          () => colors.tint,
          () => colors.tint,
          () => colors.tint,
          () => colors.tint,
          () => colors.tint,
          () => colors.tint,
        ],
      },
    ],
  };

  return (
    <>
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{display: 'flex', flexDirection:'row', alignItems: 'center', gap: 10}}>
          <IconSymbol name='chart.bar.fill' size={40} color={colors.tint}/>
          <Text style={[styles.header, { color: colors.text }]}>Analisis Produktivitas</Text>
        </View>
        <Text style={[styles.subHeader, { color: colors.secondaryText }]}>
            Pantau performa dan pencapaian Anda
        </Text>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
            <View style={[styles.statCard, styles.totalCompletedCard]}>
            <FontAwesome6 name='check' color="green" size={20} style={[styles.statIcon, { color: colors.tint }]}/>
            <Text style={[styles.statLabel, { color: colors.text }]}>Total Selesai</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{mockStats.totalCompleted}</Text>
            </View>
            <View style={[styles.statCard, styles.efficiencyCard]}>
            <FontAwesome6 name='chart-simple' color="green" size={20} style={[styles.statIcon, {color : "#28a745"}]}/>
            <Text style={[styles.statLabel, { color: colors.text }]}>Efisiensi Total</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{mockStats.totalEfficiency}%</Text>
            </View>
            <View style={[styles.statCard, styles.weekCompletedCard]}>
            <FontAwesome6 name='calendar' color="green" size={20} style={[styles.statIcon, {color : "#fd7e14"}]}/>
            <Text style={[styles.statLabel, { color: colors.text }]}>Minggu Ini</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{mockStats.weekCompleted}</Text>
            </View>
            <View style={[styles.statCard, styles.weekEfficiencyCard]}>
            <FontAwesome6 name='chart-pie' color="green" size={20} style={[styles.statIcon, {color : "#6f42c1"}]}/>
            <Text style={[styles.statLabel, { color: colors.text }]}>Efisiensi Minggu</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{mockStats.weekEfficiency}%</Text>
            </View>
        </View>

        {/* Summary Section */}
        <View style={[styles.summaryContainer, { backgroundColor: colors.card || colors.background }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ringkasan Statistik</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.text }]}>Total Tugas</Text>
                  <Text style={[styles.summaryValue, { color: colors.text }]}>{mockStats.totalTasks}</Text>
              </View>
              <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.text }]}>Selesai</Text>
                  <Text style={[styles.summaryValue, { color: colors.text }]}>{mockStats.completed}</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.text }]}>Pending</Text>
                  <Text style={[styles.summaryValue, { color: '#dc3545' }]}>{mockStats.pending}</Text>
              </View>
              <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.text }]}>Prioritas Rendah</Text>
                  <Text style={[styles.summaryValue, { color: '#28a745' }]}>{mockStats.lowPriority}</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.text }]}>Prioritas Sedang</Text>
                  <Text style={[styles.summaryValue, { color: '#fd7e14' }]}>{mockStats.mediumPriority}</Text>
              </View>
              <View style={styles.summaryItem}>
                  <Text style={[styles.summaryLabel, { color: colors.text }]}>Prioritas Tinggi</Text>
                  <Text style={[styles.summaryValue, { color: '#dc3545' }]}>{mockStats.highPriority}</Text>
              </View>
            </View>
        </View>

        {/* Chart Section */}
        <View style={[styles.chartContainer, { backgroundColor: colors.card || colors.background }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Tugas Selesai Per Hari</Text>
            <BarChart
              data={barChartData}
              width={screenWidth - 47}
              height={230}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={true}
              showBarTops={false}
              fromZero
              withHorizontalLabels={false}
              withCustomBarColorFromData
              flatColor
              style={styles.chart}
            />
        </View>

        {/* Priority Distribution Section (Placeholder for Pie Chart) */}
        <View style={[styles.chartContainer, { backgroundColor: colors.card || colors.background }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Distribusi Prioritas</Text>
            <Text style={[styles.placeholderText, { color: colors.secondaryText }]}>
            Grafik distribusi prioritas (bisa ditambahkan dengan PieChart dari react-native-chart-kit)
            </Text>
        </View>
        </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#252a3f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: (Dimensions.get('window').width - 48) / 2,
    marginBottom: 8,
  },
  totalCompletedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  efficiencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  weekCompletedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#fd7e14',
  },
  weekEfficiencyCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#6f42c1',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartContainer: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 0,
    borderRadius: 8,
    paddingRight: 10,
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
  },
});

export default AnalysisScreen;