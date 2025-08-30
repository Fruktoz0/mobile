import { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, Image, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { allBadges, userBadges, userReportCount } from '../../services/badgeService';
import { fetchUserData } from '../../hooks/fetchUserData';
import { API_URL } from '../../config/apiConfig';

const BadgesScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingBadges, setLoadingBadges] = useState(true);

  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // 1) user betöltése (id innen jön)
  useEffect(() => {
    const loadUser = async () => {
      try {
        await fetchUserData(setUser);
      } catch (err) {
        setError(err.message || 'Nem sikerült betölteni a felhasználót.');
        setSnackbarVisible(true);
      } finally {
        setLoadingUser(false);
      }
    };
    loadUser();
  }, []);

  // 2) badge-ek + reportCount betöltése, ha van user.id
  useEffect(() => {
    if (!user?.id) return;
    const loadBadges = async () => {
      try {
        const [all, earned, reportCount] = await Promise.all([
          allBadges(),
          userBadges(user.id),
          userReportCount(),
        ]);

        const merged = all.map((badge) => {
          const ub = earned.find((u) => u.badgeId === badge.id);
          const required = Number(badge.criteriaValue); // a DB-ben ez mondja meg a küszöböt
          const progress = Math.min((Number(reportCount) / required) * 100, 100);

          return {
            ...badge,
            unlocked: Boolean(ub),
            earnedAt: ub?.createdAt ?? null,
            progress,
          };
        });

        setBadges(merged);
      } catch (err) {
        setError(err.message || 'Nem sikerült betölteni a jelvényeket.');
        setSnackbarVisible(true);
      } finally {
        setLoadingBadges(false);
      }
    };
    loadBadges();
  }, [user?.id]);

  const loading = loadingUser || loadingBadges;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainTabs')}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.backText}>Jelvényeim</Text>
        {/* jobb oldali helykitöltő, hogy középen maradjon a cím */}
        <View style={{ width: 24, marginRight: 16 }} />
      </View>

      <View style={styles.card}>
        {loading ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={badges}
            numColumns={2}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nincs megjeleníthető jelvény.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.badgeItem}>
                <Image
                  source={{ uri: `${API_URL}${item.iconUrl}` }}
                  style={[
                    styles.badgeImage,
                    !item.unlocked && { opacity: 0.3 }, //  szürkítés, ez jelzi, hogy nem feloldott még
                  ]}
                />
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>

                {item.unlocked ? (
                  <Text style={styles.badgeDate}>
                    {item.earnedAt ? new Date(item.earnedAt).toLocaleDateString() : 'Feloldva'}
                  </Text>
                ) : (
                  <View style={styles.progressWrapper}>
                    <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
                  </View>
                )}
              </View>
            )}
          />
        )}
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}
      >
        {error}
      </Snackbar>
    </View>
  );
};

export default BadgesScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAF8',
    flex: 1,
  },
  header: {
    marginStart: 16,
    paddingTop: 36,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },

  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 15,
    borderRadius: 10,
    paddingVertical: 12,
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  badgeItem: {
    flex: 1,
    alignItems: 'center',
    margin: 12,
    marginTop: 10
  },
  badgeImage: {
    width: 80,
    height: 80,
    marginBottom: 6,
    resizeMode: 'contain',
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  badgeDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },

  progressWrapper: {
    width: 60,
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFC107',
  },

  loaderWrap: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#888',
  },
});
