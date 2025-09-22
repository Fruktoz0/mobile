import { StyleSheet, View, Text, ImageBackground, ScrollView } from "react-native";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { Button } from "react-native-paper";
import { Info } from 'lucide-react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

import moment from "moment";
import { API_URL } from "../config/apiConfig";
import { getChallengeById } from "../services/challengeService";
import { getUserProfile } from "../services/profileService";

const ChallengeDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userChallenge } = route.params;
  const challengeId = userChallenge.challengeId
  const status = userChallenge.status
  const [remainingTime, setRemainingTime] = useState("");
  const [challenge, setChallenge] = useState(null)
  const [user, setUser] = useState(null)


  const today = new Date().toISOString().split("T")[0];

  const statusButtonLabels = {
    pending: "Elbírálás alatt",
    approved: "Jóváhagyva",
    rejected: "Elutasítva",
    expired: "Lejárt"
  };

  //Tiltás admin és intézménynek a saját intézményi kihívásaihoz
  const canSubmit = user && challenge && (
    user.role !== "admin" && !(user.role === "institution" && user.institutionId === challenge.institutionId)
  )

  const loadChallengeDetails = async () => {
    try {
      const data = await getChallengeById(challengeId)
      setChallenge(data)
    } catch (err) {
      console.error(err)
    }
  }

  const loadUser = async () => {
    const user = await getUserProfile()
    setUser(user)
  }

  useFocusEffect(
    useCallback(() => {
      loadChallengeDetails()
      loadUser()
    }, [challengeId])
  )

  useFocusEffect(
    useCallback(() => {
      if (challenge?.endDate) {
        const end = moment(challenge.endDate);
        const now = moment();

        if (end.isBefore(now)) {
          setRemainingTime("Lejárt");
        } else {
          const totalMinutes = end.diff(now, "minutes");
          const days = Math.floor(totalMinutes / (60 * 24));
          const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
          const minutes = totalMinutes % 60;

          setRemainingTime(`${days} nap ${hours} óra ${minutes} perc`);
        }
      }
    }, [challenge?.endDate])
  );
  if (!challenge) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Betöltés...</Text>
      </View>
    )
  }

  return (
    <ImageBackground
      source={{ uri: `${API_URL}${challenge?.image}` }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.badgeWrapper}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Kihívás</Text>
            </View>
          </View>

          <Text style={styles.title}>{challenge.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar" size={16} color="#777" />
              <Text style={styles.meta}>
                {new Date(challenge.startDate).toISOString().split("T")[0]}
              </Text>
            </View>
            {status !== "approved" && (
              <View style={styles.metaItem}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#777" />
                <Text style={styles.meta}>{remainingTime}</Text>
              </View>
            )}
          </View>
          <View style={styles.infoBox}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={styles.infoTitle}>Hogyan működik?</Text>
              <Info size={16} color="#4A90E2" />
            </View>

            <Text style={styles.infoText}>
              A kihívás teljesítéséhez olvasd el a feladat leírását, majd töltsd fel a
              szükséges bizonyítékot. A beküldés után az intézmény jóváhagyja vagy
              elutasítja a teljesítést.
            </Text>
          </View>

          <View style={styles.taskBox}>
            <Text style={styles.taskTitle}>Feladat</Text>
            <Text style={styles.taskText}>{challenge.description}</Text>
          </View>

          {canSubmit && (

            challenge.endDate < today ? (
              <Text style={styles.expiredText}>
                Lejárt, figyeld az új kihívásokat!
              </Text>
            ) : (
              <Button
                mode="contained"
                style={styles.submitButton}
                textColor="#fff"
                theme={{ colors: { primary: "#4A90E2" } }}
                disabled={status !== "unlocked"}
                onPress={() =>
                  navigation.navigate("ChallengeSubmit", { challengeId: challenge.id })
                }
              >
                {statusButtonLabels[status] || "Készre jelentés"}
              </Button>
            )
          )}
          {status === "approved" && (
            <View>
              <Text style={{ alignSelf: "center", fontSize: 30, color: "#388E3C" }}>
                Jóváhagyva
              </Text>
              <Text style={{ alignSelf: "center", fontSize: 14, marginTop: 15, color: "#388E3C" }}>
                Kapott pontok: {userChallenge.pointsEarned}
              </Text>
              <Text style={{ position: "absolute", bottom: -60, fontSize: 12 }}>Jóváhagyás időpontja: {" "}
                {new Date(userChallenge.approvedAt).toLocaleDateString("hu-HU")}
              </Text>
            </View>

          )}


        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default ChallengeDetailsScreen;

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)" },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    padding: 16,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.95)", // kicsit áttetsző
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    height: "70%",
    position: "relative",
  },

  badgeWrapper: {
    position: "absolute",
    top: -14, // picit kilógjon a kártya tetején
    alignSelf: "center",
    zIndex: 10,
  },
  badge: {
    backgroundColor: "#4A90E2",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 12,
    color: "#222",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  meta: {
    fontSize: 13,
    color: "#777",
  },

  infoBox: {
    backgroundColor: "hsla(0, 0%, 100%, 0.69)", // áttetsző szürke
    borderRadius: 12,
    padding: 12,
    marginVertical: 16,
  },
  infoTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 15,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  taskBox: {
    marginBottom: 20,
  },
  taskTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  taskText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  submitButton: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 6,
  },
  expiredText: {
    textAlign: "center",
    color: "#E74C3C",
    fontWeight: "600",
    marginTop: 8,
  }

});
