import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

function DefaultRenderer(entities, screen, layout) {
  if (!entities) return null;
  return Object.keys(entities)
    .filter((key) => entities[key].renderer)
    .map((key) => {
      const entity = entities[key];
      if (typeof entity.renderer === 'object') {
        return (
          <entity.renderer.type
            key={key}
            screen={screen}
            layout={layout}
            {...entity}
          />
        );
      } else if (typeof entity.renderer === 'function') {
        return (
          <entity.renderer
            key={key}
            screen={screen}
            layout={layout}
            {...entity}
          />
        );
      }
      return null;
    });
}

export default function GameEngine({ systems, entities, running, style, children }) {
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const entitiesRef = useRef(entities);
  const [, setTick] = useState(0);

  useEffect(() => {
    entitiesRef.current = entities;
  }, [entities]);

  useEffect(() => {
    if (!running) {
      lastTimeRef.current = null;
      return;
    }

    const tick = (timestamp) => {
      if (!running) return;
      if (lastTimeRef.current === null) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const args = {
        time: {
          current: timestamp,
          previous: timestamp - delta,
          delta: delta,
          previousDelta: delta,
        },
        touches: [],
        events: [],
        dispatch: () => {},
        screen: { width: 0, height: 0 },
      };

      const newEntities = systems.reduce(
        (state, sys) => sys(state, args),
        entitiesRef.current
      );
      entitiesRef.current = newEntities;
      setTick((t) => t + 1);

      rafRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, systems]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.entityContainer}>
        {DefaultRenderer(entitiesRef.current, { width: 0, height: 0 }, null)}
      </View>
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  entityContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
