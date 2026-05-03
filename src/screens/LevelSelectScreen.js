import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LEVELS } from '../levels';

export default function LevelSelectScreen({ onSelect, onBack }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺 Select Level</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
        {LEVELS.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[styles.card, { borderColor: level.color }]}
            onPress={() => onSelect(level.id)}
          >
            <View style={[styles.difficultyBadge, { backgroundColor: level.color }]}>
              <Text style={styles.difficultyText}>{level.difficulty}</Text>
            </View>
            <Text style={styles.levelName}>{level.name}</Text>
            <Text style={styles.levelDesc}>{level.description}</Text>
            <View style={styles.statsRow}>
              <Text style={styles.stat}>💰 {level.startGold}</Text>
              <Text style={styles.stat}>❤️ {level.baseMaxHealth}</Text>
              <Text style={styles.stat}>🌊 {level.waves.length} waves</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2a1a',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 24,
  },
  scroll: {
    flex: 1,
  },
  list: {
    gap: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  levelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  levelDesc: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 12,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    fontSize: 14,
    color: '#ccc',
  },
  backBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
