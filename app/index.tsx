import { Redirect } from 'expo-router';

export default function Index() {
  // Leading slash is required in the href path
  return <Redirect href="/trips" />;
} 