import {
    Text, View, StyleSheet, TouchableOpacity, Image, StatusBar, Platform, useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useResponsive } from '../hooks/useResponsiveness';
import { useFonts } from 'expo-font';
import {
  Sora_100Thin,
  Sora_200ExtraLight,
  Sora_300Light,
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
  Sora_800ExtraBold,
} from '@expo-google-fonts/sora';


export default function WelcomeScreen() {

    const { width, height } = useWindowDimensions();
    const router = useRouter();
    const { scale, isTablet, spacing, fontSize } = useResponsive();

    return <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.content}>
            {/* Bike Image Section */}
            <View style={[styles.imageSection, { height: isTablet ? height * 0.5 : height * 0.45 }]}>
                {/* Big orange circle */}
                <View style={[styles.orangeCircle, { width: scale(320), height: scale(320), right: scale(-60), top: isTablet ? '25%' : '15%' }]}>
                    {/* Small decorative dot */}
                    <View style={[styles.smallDot, {
                        width: scale(12),
                        height: scale(12),
                        top: scale(20),
                        left: scale(-40),
                    }]} />
                </View>
                {/* Bike Image */}
                <Image
                    source={require('@/assets/images/bike.png')}
                    style={[styles.bikeImage, {
                        width: isTablet ? scale(380) : scale(320),
                        height: isTablet ? scale(380) : scale(320),
                        right: scale(-30),
                    }]}
                    resizeMode='contain'
                />
            </View>

            {/* Text Section */}

        </View>

    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    orangeCircle: {
        position: 'absolute',
        borderRadius: 1000,
        backgroundColor: '#F17500',
    },
    imageSection: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    smallDot: {
        position: 'absolute',
        borderRadius: 100,
        backgroundColor: '#F17500',
    },
    bikeImage: {
        zIndex: 2,
    },
})