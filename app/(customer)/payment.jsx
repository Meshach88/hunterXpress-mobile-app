import { View, Text, Platform, Alert, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useState, useRef } from 'react'
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useResponsive } from '@/hooks/use-responsiveness';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';


const PaymentScreen = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { order } = useLocalSearchParams();
    const orderDetails = JSON.parse(order);
    // console.log('Parameters for delivery', orderDetails)
    const { scale, spacing, fontSize, isTablet } = useResponsive();
    const [isCalculating, setIsCalculating] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(null);
    const [showPayment, setShowPayment] = useState(false);

    const orderItems = [
        {
            id: 'order_reference',
            title: 'Order Reference',
            content: (orderDetails?.order.order_reference).toUpperCase() || 'No reference ID'
        },
        {
            id: 'sender_address',
            title: "Sender's Address",
            content: orderDetails?.order.pickup_address || 'No address found.'
        },
        {
            id: 'receiver_address',
            title: "Receiver's Address",
            content: orderDetails?.order.dropoff_address || 'No address found.'
        },
        {
            id: 'description',
            title: 'Description',
            content: orderDetails?.order.package_details.description || 'Delivery item'
        },
        {
            id: 'price',
            title: 'Price',
            content: `₦ ${Number((orderDetails?.order.price)) || 1000}`
        },
    ]

    const calculateDeliveryFee = async () => {
        setIsCalculating(true);
        //Mock API response
        setTimeout(() => {
            setDeliveryFee(2000);
            setShowPayment(true);
            setIsCalculating(false);
        }, 2000);
    }

    const handlePaymentSuccess = async (response) => {
        console.log('Payment success:', response);

        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setShowPayment(false);
        Alert.alert(
            'Success',
            'Payment completed successfully!',
            [
                {
                    text: 'OK',
                    onPress: () => router.push({
                        pathname: '/(customer)/order-confirmed',
                        params: { response }
                    }),
                },
            ]
        );
    }

    const handlePaymentCancel = () => {
        console.log('Payment cancelled');

        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        }
        setShowPayment(false);
        Alert.alert("Payment cancelled", 'Your payment was cancelled.')
    }

    const handleBack = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        router.back();
    };

    const handleConfirm = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        calculateDeliveryFee();
    };

    // Generate Paystack payment HTML
    const generatePaystackHTML = () => {
        const paystackKey = "pk_test_021ddf45c04e98f437dda145053566a38258b796";
        const amountInKobo = deliveryFee * 100; // Paystack uses kobo (smallest currency unit)

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://js.paystack.co/v1/inline.js"></script>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                        background: #f8f8f8;
                    }
                    .container {
                        text-align: center;
                        padding: 20px;
                    }
                    button {
                        background: #F17500;
                        color: white;
                        border: none;
                        padding: 16px 32px;
                        border-radius: 28px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    button:active {
                        transform: scale(0.98);
                    }
                    .amount {
                        font-size: 32px;
                        font-weight: 700;
                        margin: 20px 0;
                    }
                    .label {
                        color: #666;
                        margin-bottom: 8px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="label">Delivery Fee</div>
                    <div class="amount">₦${deliveryFee?.toLocaleString()}</div>
                    <button onclick="payWithPaystack()">Pay Now</button>
                </div>
                
                <script>
                    function payWithPaystack() {
                        var handler = PaystackPop.setup({
                            key: '${paystackKey}',
                            email: '${user?.email || 'customer@example.com'}',
                            amount: ${amountInKobo},
                            currency: 'NGN',
                            ref: 'ORDER_${orderDetails?.order?.order_reference}_' + Math.floor((Math.random() * 1000000000) + 1),
                            metadata: {
                                custom_fields: [
                                    {
                                        display_name: "Order Reference",
                                        variable_name: "order_reference",
                                        value: "${orderDetails?.order?.order_reference}"
                                    }
                                ]
                            },
                            callback: function(response) {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    event: 'success',
                                    data: response
                                }));
                            },
                            onClose: function() {
                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                    event: 'cancelled'
                                }));
                            }
                        });
                        handler.openIframe();
                    }
                    
                    // Auto-trigger payment on load
                    setTimeout(() => {
                        payWithPaystack();
                    }, 500);
                </script>
            </body>
            </html>
        `;
    };

    const handleWebViewMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.event === 'success') {
                handlePaymentSuccess(data.data);
            } else if (data.event === 'cancelled') {
                handlePaymentCancel();
            }
        } catch (error) {
            console.error('Error parsing WebView message:', error);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Back Button */}
                <TouchableOpacity
                    style={[styles.backButton, {
                        marginTop: spacing.md,
                        marginLeft: spacing.lg
                    }]}
                    onPress={handleBack}
                >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={[styles.heading, { fontSize: isTablet ? fontSize.xxxl : fontSize.xxl }]}>Order Created</Text>

                    {/* Order Details */}
                    <View style={styles.orderDetails}>
                        {
                            orderItems.map((item, index) => (
                                <View key={item.id} style={styles.orderItem}>
                                    <Text style={[styles.itemTitle, { fontSize: isTablet ? fontSize.lg : fontSize.md }]}>
                                        {item.title}
                                    </Text>
                                    <Text style={[styles.itemContent, { fontSize: isTablet ? fontSize.md : fontSize.sm }]}>
                                        {item.content}
                                    </Text>
                                </View>
                            ))
                        }
                    </View>

                    {/* Payment Button */}
                    <TouchableOpacity
                        style={[styles.confirmButton,
                        {
                            height: scale(56),
                            marginTop: spacing.xl * 2,
                        }
                        ]}
                        onPress={handleConfirm}
                        activeOpacity={0.8}
                        disabled={isCalculating}
                    >
                        <Text style={[
                            styles.confirmButtonText,
                            { fontSize: isTablet ? fontSize.lg : fontSize.md }
                        ]}>
                            {isCalculating ? 'Calculating...' : 'Proceed to Payment'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Paystack Payment Modal */}
            {showPayment && deliveryFee && (
                <Modal
                    visible={showPayment}
                    animationType='slide'
                    onRequestClose={() => setShowPayment(false)}
                >
                    <SafeAreaView style={styles.paymentContainer}>
                        <View style={styles.paymentHeader}>
                            <Text style={styles.paymentTitle}>Complete Payment</Text>
                            <TouchableOpacity onPress={handlePaymentCancel}>
                                <Ionicons name='close' size={28} color='#000' />
                            </TouchableOpacity>
                        </View>

                        <WebView
                            source={{ html: generatePaystackHTML() }}
                            onMessage={handleWebViewMessage}
                            style={styles.webview}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                        />
                    </SafeAreaView>
                </Modal>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    scrollContent: {
        paddingBottom: 120,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    content: {
        width: '90%',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 30,
        marginHorizontal: 'auto',
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            }
        })
    },

    heading: {
        fontFamily: 'Sora-Bold',
        marginBottom: 10,
    },

    orderDetails: {
        width: '100%',
        marginTop: 20,
        gap: 16,
    },

    orderItem: {
        backgroundColor: '#F8F8F8',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#74BF22',
    },

    itemTitle: {
        fontFamily: 'Sora-SemiBold',
        color: '#666',
        marginBottom: 6,
    },

    itemContent: {
        fontFamily: 'Sora-Regular',
        color: '#000',
        lineHeight: 20,
    },

    confirmButton: {
        width: '100%',
        paddingHorizontal: 20,
        backgroundColor: '#F17500',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    confirmButtonText: {
        color: '#fff',
        fontFamily: 'Sora-SemiBold',
    },
    paymentContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    paymentTitle: {
        fontSize: 20,
        fontFamily: 'Sora-Bold',
    },
    webview: {
        flex: 1,
    },
})

export default PaymentScreen;