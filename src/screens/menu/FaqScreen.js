import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { List } from 'react-native-paper';
import { useState } from 'react';



const FaqScreen = () => {

  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const faqData = [
    {
      id: 1,
      question: 'Hogyan tudok bejelentést tenni?',
      answer: 'A főképernyőn kattints a "Bejelentés" gombra, töltsd ki a szükséges adatokat és küldd el a bejelentést.'
    },
    {
      id: 2,
      question: 'Hogyan követhetem a bejelentésem állapotát?',
      answer: 'A "Saját bejelentéseim" menüpontban megtekintheted az összes elküldött bejelentésed státuszát.'
    },
    {
      id: 3,
      question: 'Hogyan tudok képet feltölteni?',
      answer: 'A bejelentés létrehozásakor a képfeltöltés résznél maximum 3 fotót adhatsz hozzá.'
    },
    {
      id: 4,
      question: 'Szükséges regisztrálnom a bejelentéshez?',
      answer: 'Igen, a bejelentések leadásához be kell jelentkezned, így biztosítható a visszajelzés és a státusz követése.'
    },
    {
      id: 5,
      question: 'Milyen típusú problémákat jelenthetek?',
      answer: 'Jelenthetsz közterületi hibákat, közvilágítási problémákat, szemétlerakást, rongálást és egyéb közösségi ügyeket.'
    },
    {
      id: 6,
      question: 'Mennyi idő alatt dolgozzák fel a bejelentésemet?',
      answer: 'Az esetek többségében 2-5 munkanapon belül visszajelzést kapsz a bejelentés állapotáról.'
    },
    {
      id: 7,
      question: 'Kapok értesítést, ha változik a bejelentésem státusza?',
      answer: 'Igen, az alkalmazás értesítést küld, ha a bejelentésed állapota módosul.'
    },
    {
      id: 8,
      question: 'Törölhetem a leadott bejelentésemet?',
      answer: 'Leadott bejelentés törlésére nincs lehetőség, viszont jelezheted az intézmény felé, ha már nem aktuális.'
    },
    {
      id: 9,
      question: 'Mit tegyek, ha hibát tapasztalok az alkalmazásban?',
      answer: 'A beállítások menüpontban található "Hiba jelentése" funkcióval küldhetsz visszajelzést a fejlesztőknek.'
    },
    {
      id: 10,
      question: 'Hogyan tudom módosítani a profiladataimat?',
      answer: 'A "Profilom" menüpontban szerkesztheted a neved, e-mail címed és profilképed.'
    }
  ];

  const navigation = useNavigation()
  return (
    <ScrollView style={styles.container}>
      <View >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={24} color="black" />
            <Text style={styles.backText}>GY.I.K</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {faqData.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <List.Accordion
                titleNumberOfLines={3}
                style={styles.card}
                contentStyle={styles.cardContent}
                title={item.question}
                titleStyle={styles.title}
                expanded={expanded === item.id}
                onPress={() => toggleExpand(item.id)}
                left={(props) => <List.Icon {...props} icon="help-circle-outline" color="#009688" />}
              >
                <List.Item
                  title={item.answer}
                  titleNumberOfLines={8}
                  style={styles.item}
                />
              </List.Accordion>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>

  )
}

export default FaqScreen

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 8,
  },
  header: {
    marginStart: 16,
    paddingTop: 32,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAF8',
  },
  content: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#FAFAF8',
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000'
  },
  cardWrapper: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  },
  cardContent: {
    paddingVertical: 6,
    backgroundColor: '#FFFFFF'
  },
  item: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  }

})