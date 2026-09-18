import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { AppScreen } from '../../../shared/components/AppScreen';

export function AddScreen() {
  return (
    <AppScreen>
      <Text style={styles.title}>Add</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create((theme) => ({
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
}));
