import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../src/theme';

export default function CoachScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Coach IA</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: theme.colors.text,
        fontSize: theme.typography.sizes.xl,
        fontFamily: theme.typography.fontFamily,
        fontWeight: 'bold',
    },
});
