import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { useResponsive } from '@/hooks/use-responsiveness';

export default function TransactionList({ transactions, router }) {
    const { theme } = useTheme();
    const { scale } = useResponsive();

    const handleDetailsPress = (id) => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        // router.push(`/transaction/${id}`);
        router.push('/(tabs)/history');
    };

    return (
        <View style={[styles.container, { backgroundColor: '#97CF5C' }]}>
            <Text style={styles.title}>Recent Transactions</Text>

            {transactions.map((transaction, index) => (
                <View
                    key={transaction.id}
                    style={[
                        styles.transactionItem,
                        index !== transactions.length - 1 && styles.transactionBorder,
                    ]}
                >
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="motorbike" size={28} color="#000" />
                    </View>

                    <View style={styles.transactionDetails}>
                        <View style={styles.statusContainer}>
                            <View style={styles.statusRow}>
                                <Ionicons name="location" size={12} color="#27794D" style={{marginRight: 6}} />
                                <Text style={styles.status}>{transaction.status}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.detailsButton}
                                onPress={() => handleDetailsPress(transaction.id)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.detailsText}>Details</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.address} numberOfLines={1}>
                            {transaction.address}
                        </Text>
                        <Text style={styles.time}>{transaction.timeToLocation}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 20,
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
    title: {
        fontSize: 20,
        fontFamily: 'Sora-Medium',
        color: '#000',
        marginBottom: 16,
        textAlign: 'center'
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    transactionBorder: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionDetails: {
        flex: 1,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    status: {
        fontSize: 12,
        fontFamily: 'Sora-Regular',
        color: 'rgba(0, 0, 0, 0.6)',
    },
    address: {
        fontSize: 14,
        fontFamily: 'Sora-Regular',
        color: '#000',
        marginBottom: 2,
    },
    time: {
        fontSize: 12,
        fontFamily: 'Sora-Regular',
        color: 'rgba(0, 0, 0, 0.6)',
    },
    detailsButton: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 5,
    },
    detailsText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'Sora-Medium',
    },
});