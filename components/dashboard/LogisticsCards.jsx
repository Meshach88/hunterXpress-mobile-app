import React from "react";
import { View, Text, StyleSheet, ImageBackground, useWindowDimensions, Pressable } from "react-native";
import * as Haptics from 'expo-haptics';

const LogisticsCard = ({
    title,
    subtitle,
    imageSource,
    titleColor = "#111",
    style,
    onPress
}) => {
    const shouldFlip = title === 'STATS';
    const isSmallTitle = title === 'STATS' || title === 'TRACK'
    const isTrack = title === 'TRACK'

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (onPress) onPress();
    };

    return (
        <Pressable
            onPress={handlePress}
            style={style}
        >
            <ImageBackground
                source={imageSource}
                style={styles.cardContainer}
                resizeMode="stretch"
            >
                <View style={styles.content}>
                    <Text style={[styles.title, { color: titleColor, transform: shouldFlip ? [{ scaleY: -1 }] : undefined, fontSize: isSmallTitle ? 24 : 28, fontFamily: isSmallTitle ? 'Montserrat-Bold' : 'Montserrat-ExtraBold', marginTop: shouldFlip ? 80 : undefined, marginBottom: isTrack ? -40 : undefined }]}>{title}</Text>
                </View>
            </ImageBackground>
        </Pressable>
    );
};

const LogisticsCards = ({router}) => {
    const { width } = useWindowDimensions();
    const cardWidth = (width - 40) / 2;
    const cardHeight = 200;

    const handleCardPress = (route) => {
        router.push(route);
    };

    return (
        <View style={styles.container}>
            {/* Top Row */}
            <View style={styles.topRow}>
                {/* SEND card - Orange, left side */}
                <LogisticsCard
                    title="SEND"
                    imageSource={require('@/assets/images/send_box.png')}
                    titleColor="#F17500"
                    onPress={() => handleCardPress('/(customer)/send')}
                    style={[styles.card, {
                        width: cardWidth + 40,
                        height: cardHeight,
                        zIndex: 10
                    }]}
                />

                {/* STATS card - White, right side, slightly overlapping */}
                <LogisticsCard
                    title="STATS"
                    imageSource={require('@/assets/images/stat_card.png')}
                    titleColor="#000"
                    onPress={() => handleCardPress('/(customer)/stats')}
                    style={[styles.card, {
                        width: cardWidth + 40,
                        height: cardHeight * 0.8,
                        marginLeft: -40, // Overlap with SEND
                        marginTop: 25,
                        zIndex: 1,
                        transform: [{ scaleY: -1 }]
                    }]}
                />
            </View>

            {/* Bottom Row */}
            <View style={styles.bottomRow}>
                {/* TRACK card - White, left side */}
                <LogisticsCard
                    title="TRACK"
                    imageSource={require('@/assets/images/track_card.png')}
                    titleColor="#000"
                    onPress={() => handleCardPress('/(customer)/track-courier')}
                    style={[styles.card, {
                        width: cardWidth + 40,
                        height: cardHeight * 0.5,
                        marginTop: -40, // Overlap with SEND
                        zIndex: 1,
                    }]}
                />

                {/* RECEIVE card - Green, right side */}
                <LogisticsCard
                    title="RECEIVE"
                    imageSource={require('@/assets/images/receive_box.png')}
                    titleColor="#74BF22"
                    onPress={() => handleCardPress('/(customer)/receive')}
                    style={[styles.card, {
                        width: cardWidth + 40,
                        height: cardHeight,
                        marginLeft: -40, // Overlap with TRACK
                        marginTop: -110, // Overlap with STATS
                        zIndex: 2,
                    }]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        position: 'relative'
    },
    topRow: {
        flexDirection: 'row',
        marginBottom: 0,
        position: 'relative'
    },
    bottomRow: {
        flexDirection: 'row',
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        textAlign: 'center',
    },
});

export default LogisticsCards;