import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

const LogisticsCard = ({ 
    title, 
    subtitle, 
    bgColor = "#facc15",
    borderColor = "#c4a574",
    type = "trapezoid-left" // "hexagon", "trapezoid-right", "trapezoid-left"
}) => {
    const cardWidth = width - 40;
    const cardHeight = 150;
    const cornerRadius = 15;

    // Different path shapes
    const paths = {
        hexagon: `
            M ${cornerRadius + cardWidth * 0.15},0
            L ${cardWidth * 0.85 - cornerRadius},0
            Q ${cardWidth * 0.85},0 ${cardWidth * 0.85 + cornerRadius * 0.7},${cornerRadius * 0.7}
            L ${cardWidth - cornerRadius * 0.7},${cardHeight * 0.5 - cornerRadius * 0.7}
            Q ${cardWidth},${cardHeight * 0.5} ${cardWidth - cornerRadius * 0.7},${cardHeight * 0.5 + cornerRadius * 0.7}
            L ${cardWidth * 0.85 + cornerRadius * 0.7},${cardHeight - cornerRadius * 0.7}
            Q ${cardWidth * 0.85},${cardHeight} ${cardWidth * 0.85 - cornerRadius},${cardHeight}
            L ${cardWidth * 0.15 + cornerRadius},${cardHeight}
            Q ${cardWidth * 0.15},${cardHeight} ${cardWidth * 0.15 - cornerRadius * 0.7},${cardHeight - cornerRadius * 0.7}
            L ${cornerRadius * 0.7},${cardHeight * 0.5 + cornerRadius * 0.7}
            Q 0,${cardHeight * 0.5} ${cornerRadius * 0.7},${cardHeight * 0.5 - cornerRadius * 0.7}
            L ${cardWidth * 0.15 - cornerRadius * 0.7},${cornerRadius * 0.7}
            Q ${cardWidth * 0.15},0 ${cardWidth * 0.15 + cornerRadius},0
            Z
        `,
        "trapezoid-right": `
            M ${cornerRadius},0
            L ${cardWidth * 0.85 - cornerRadius},0
            Q ${cardWidth * 0.85},0 ${cardWidth * 0.85 + cornerRadius * 0.5},${cornerRadius * 0.5}
            L ${cardWidth - cornerRadius * 0.5},${cardHeight - cornerRadius}
            Q ${cardWidth},${cardHeight - cornerRadius * 0.5} ${cardWidth - cornerRadius},${cardHeight}
            L ${cornerRadius},${cardHeight}
            Q 0,${cardHeight} 0,${cardHeight - cornerRadius}
            L 0,${cornerRadius}
            Q 0,0 ${cornerRadius},0
            Z
        `,
        "trapezoid-left": `
            M ${cornerRadius},0
            L ${cardWidth - cornerRadius},0
            Q ${cardWidth},0 ${cardWidth},${cornerRadius}
            L ${cardWidth},${cardHeight - cornerRadius}
            Q ${cardWidth},${cardHeight} ${cardWidth - cornerRadius},${cardHeight}
            L ${cardWidth * 0.15 + cornerRadius},${cardHeight}
            Q ${cardWidth * 0.15},${cardHeight} ${cardWidth * 0.15 - cornerRadius * 0.5},${cardHeight - cornerRadius * 0.5}
            L ${cornerRadius * 0.5},${cornerRadius}
            Q 0,0 ${cornerRadius},0
            Z
        `
    };

    return (
        <View style={[styles.cardContainer, { width: cardWidth, height: cardHeight }]}>
            <Svg height={cardHeight} width={cardWidth} style={StyleSheet.absoluteFill}>
                {/* Fill */}
                <Path d={paths[type]} fill={bgColor} />
                {/* Border */}
                <Path d={paths[type]} fill="none" stroke={borderColor} strokeWidth="2" />
            </Svg>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginVertical: 20,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111",
    },
    subtitle: {
        fontSize: 14,
        color: "#333",
        marginTop: 5,
    },
});

export default LogisticsCard;