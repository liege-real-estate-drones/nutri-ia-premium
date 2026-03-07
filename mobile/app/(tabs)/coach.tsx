import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Send, Mic, Image as ImageIcon } from 'lucide-react-native';
import { theme } from '../../src/theme';
import { useNutriStore } from '../../src/store/useNutriStore';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
};

export default function CoachScreen() {
    const { consumedKcal, goalKcal, profile } = useNutriStore();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: `Bonjour ! Je suis ton coach Nutri-IA. Tu as un TMB de ${profile.bmr} kcal et un objectif de ${profile.goal}. Comment puis-je t'aider aujourd'hui ?`, sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input.trim(), sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI context-aware reply
        setTimeout(() => {
            let aiText = "Je vois que tu t'intéresses à ta nutrition.";
            if (userMsg.text.toLowerCase().includes('mangé') || userMsg.text.toLowerCase().includes('calories')) {
                aiText = `Aujourd'hui, tu as consommé ${consumedKcal} kcal sur ton objectif de ${goalKcal} kcal. Il te reste encore ${Math.max(0, goalKcal - consumedKcal)} kcal, tu es parfaitement dans les clous pour ta recomposition !`;
            }

            const aiMsg: Message = { id: (Date.now() + 1).toString(), text: aiText, sender: 'ai' };
            setMessages(prev => [...prev, aiMsg]);
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Coach IA</Text>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.chatArea}
                contentContainerStyle={styles.chatContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((msg) => (
                    <View key={msg.id} style={[
                        styles.bubbleContainer,
                        msg.sender === 'user' ? styles.bubbleUserContainer : styles.bubbleAiContainer
                    ]}>
                        <View style={[
                            styles.bubble,
                            msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAi
                        ]}>
                            <Text style={[
                                styles.messageText,
                                msg.sender === 'user' ? styles.messageUserText : styles.messageAiText
                            ]}>{msg.text}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputArea}>
                <TouchableOpacity style={styles.iconButton}>
                    <ImageIcon color={theme.colors.textSecondary} size={24} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Mic color={theme.colors.textSecondary} size={24} />
                </TouchableOpacity>

                <TextInput
                    style={styles.textInput}
                    placeholder="Écris un message..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={input}
                    onChangeText={setInput}
                    multiline
                />

                <TouchableOpacity
                    style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!input.trim()}
                >
                    <Send color={input.trim() ? theme.colors.primary : theme.colors.surfaceHighlight} size={20} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 16,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.surfaceHighlight,
    },
    title: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.lg,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    chatArea: {
        flex: 1,
    },
    chatContent: {
        padding: 16,
        paddingBottom: 32,
    },
    bubbleContainer: {
        marginBottom: 16,
        maxWidth: '80%',
    },
    bubbleUserContainer: {
        alignSelf: 'flex-end',
    },
    bubbleAiContainer: {
        alignSelf: 'flex-start',
    },
    bubble: {
        padding: 16,
        borderRadius: 20,
    },
    bubbleUser: {
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 4,
    },
    bubbleAi: {
        backgroundColor: theme.colors.surface,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    messageText: {
        fontSize: theme.typography.sizes.md,
        lineHeight: 22,
    },
    messageUserText: {
        color: theme.colors.background, // Noir
        fontWeight: '500',
    },
    messageAiText: {
        color: theme.colors.text,
    },
    inputArea: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.surfaceHighlight,
    },
    iconButton: {
        padding: 12,
    },
    textInput: {
        flex: 1,
        backgroundColor: theme.colors.background,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        maxHeight: 100,
        color: theme.colors.text,
        fontSize: theme.typography.sizes.md,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: theme.colors.surfaceHighlight,
    },
    sendButton: {
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    sendButtonDisabled: {
        borderColor: 'transparent',
    }
});
