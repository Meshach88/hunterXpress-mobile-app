import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useResponsive } from '../../hooks/use-responsiveness';

const { width } = Dimensions.get('window');

const HexagonalGrid = ({ navigation }) => {
  const { theme } = useTheme();
  const { scale, isTablet } = useResponsive();

  const gridItems = [
    { id: 'send', label: 'SEND', color: '#FF8C00', route: 'Send' },
    { id: 'stats', label: 'STATS', color: '#000000', route: 'Stats' },
    { id: 'track', label: 'TRACK', color: '#000000', route: 'Track' },
    { id: 'receive', label: 'RECIEVE', color: '#8BC34A', route: 'Receive' },
  ];

  const containerWidth = width - scale(40);
  const itemWidth = containerWidth / 2 - scale(10);
  const itemHeight = isTablet ? scale(140) : scale(120);

  return (
    <View style={[styles.container, { paddingHorizontal: scale(20) }]}>
      <View style={styles.gridWrapper}>
        {/* Top Row */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.gridItem,
              {
                width: itemWidth,
                height: itemHeight,
                backgroundColor: theme.colors.card,
              },
            ]}
            onPress={() => navigation.navigate(gridItems[0].route)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, { color: gridItems[0].color }]}>
              {gridItems[0].label}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.gridItem,
              {
                width: itemWidth,
                height: itemHeight,
                backgroundColor: theme.colors.card,
              },
            ]}
            onPress={() => navigation.navigate(gridItems[1].route)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, { color: gridItems[1].color }]}>
              {gridItems[1].label}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Row */}
        <View style={[styles.row, { marginTop: scale(-20) }]}>
          <TouchableOpacity
            style={[
              styles.gridItem,
              {
                width: itemWidth,
                height: itemHeight,
                backgroundColor: theme.colors.card,
              },
            ]}
            onPress={() => navigation.navigate(gridItems[2].route)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, { color: gridItems[2].color }]}>
              {gridItems[2].label}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.gridItem,
              {
                width: itemWidth,
                height: itemHeight,
                backgroundColor: theme.colors.card,
              },
            ]}
            onPress={() => navigation.navigate(gridItems[3].route)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, { color: gridItems[3].color }]}>
              {gridItems[3].label}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Decorative Lines */}
      <View style={styles.linesContainer}>
        <View style={[styles.line, styles.lineOrange]} />
        <View style={[styles.line, styles.lineGreen]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    position: 'relative',
  },
  gridWrapper: {
    position: 'relative',
    zIndex: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  label: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  linesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  line: {
    position: 'absolute',
    height: 3,
  },
  lineOrange: {
    backgroundColor: '#FF8C00',
    width: '45%',
    top: '30%',
    left: '25%',
    transform: [{ rotate: '30deg' }],
  },
  lineGreen: {
    backgroundColor: '#8BC34A',
    width: '45%',
    top: '55%',
    left: '30%',
    transform: [{ rotate: '-30deg' }],
  },
});

export default HexagonalGrid;