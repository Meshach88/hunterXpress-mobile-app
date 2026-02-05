import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LocationsScreen from '@/components/LocationsScreen'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LocationsEarningsScreen() {
    return (
        <SafeAreaView>
            <ScrollView>
                <LocationsScreen />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})